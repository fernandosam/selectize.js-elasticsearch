//(function (){
define(["elasticsearch", "jquery", "selectize"], function(elasticsearch, $, selectize) {

    var elasticClient = new $.es.Client({
        host: 'localhost:9200',
        log: 'error'
    });

    var indexName = "ipm";

    /**
     * Delete an existing index
     */
    function createArray(hits) {
        var array = [];

        for (var key in hits) {
            var element = hits[key]["_source"];
            array.push(element);
        }

        console.log(array);
        return array;
    }

    /**
     * Delete an existing index
     */
    function searchType(typeName) {
        return elasticClient.search({
            index: indexName,
            type: typeName
        });
    }

    /**
     * Delete an existing index
     */
    function deleteIndex() {
        return elasticClient.indices.delete({
            index: indexName
        });
    }

    /**
     * create the index
     */
    function initIndex() {
        return elasticClient.indices.create({
            index: indexName
        });
    }

    /**
     * check if the index exists
     */
    function indexExists() {
        return elasticClient.indices.exists({
            index: indexName
        });
    }

    function initMapping(typeName) {
        return elasticClient.indices.putMapping({
            index: indexName,
            type: typeName,
            body: {
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    suggest: {
                        type: "completion",
                        analyzer: "simple",
                        search_analyzer: "simple",
                        payloads: true
                    }
                }
            }
        });
    }

    function addDocument(typeName, document) {
        return elasticClient.index({
            index: indexName,
            type: typeName,
            body: {
                title: document.title,
                content: document.content,
                suggest: {
                    input: document.title.split(" "),
                    output: document.title,
                    payload: document.metadata || {}
                }
            }
        });
    }

    function getSuggestions(typeName, input) {
        return elasticClient.suggest({
            index: indexName,
            type: typeName,
            body: {
                docsuggest: {
                    text: input,
                    completion: {
                        field: "suggest",
                        fuzzy: true
                    }
                }
            }
        })
    }

    function addPessoa(objPessoa, typeName) {
        return elasticClient.index({
            index: indexName,
            type: typeName,
            body: {
                name: objPessoa.name,
                cpf: objPessoa.cpf
            }
        });
    }

    var selectizePessoa = function(typeName, arrayOpc, maxItens) {

        var REGEX_CPF = '([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2})';

        if (!maxItens) maxItens = null;

        var opcSelectize = {
            plugins: ['remove_button'],
            persist: true,
            maxItems: maxItens,
            valueField: 'cpf',
            labelField: 'name',
            searchField: ['name', 'cpf'],
            options: arrayOpc,
            render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.cpf ? '<span class="cpf">' + escape(item.cpf) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.cpf;
                    var caption = item.name ? item.cpf : null;
                    return '<div>' +
                        '<span class="control-label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                // 000.000.000-00
                // regex = new RegExp('^' + REGEX_CPF + '$', 'i');
                // match = input.match(regex);
                // if (match) return !this.options.hasOwnProperty(match[0]);

                // name <000.000.000-00>
                regex = new RegExp('^([^<]*)\<' + REGEX_CPF + '\>$', 'i');

                match = input.match(regex);
                if (match) {
                    return !this.options.hasOwnProperty(match[2]);
                }

                return false;
            },
            create: function(input) {
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_CPF + '\>$', 'i'));
                if (match) {
                    var pessoa = {};

                    pessoa.name = $.trim(match[1]);
                    pessoa.cpf = match[2];

                    addPessoa(pessoa, typeName);

                    return {
                        name: $.trim(match[1]),
                        cpf: match[2]
                    };
                }
                return false;
            }
        };
        return opcSelectize;
    }

    function loadSelect(idElement) {
        var res = [];
        if (idElement) res = idElement.split("-");
        var typeName = res[1];

        searchType(typeName).then(
            function(body) {
                var array = createArray(body.hits.hits);
                var param = selectizePessoa(typeName, array);
                
                $('#' + idElement).selectize(param);
            },
            function(error) {
                console.trace(error.message);
            }
        );
    }


    function loadSelects(){
        $("select").each(function(index) {
            loadSelect($(this).attr('id'));
        });
    }

    return {
        loadSelects: loadSelects
    };

});
//})();
