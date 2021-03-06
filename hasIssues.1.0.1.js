/*****************************************************************
 * hasIssues
 * @description : Grabs Issues from your GitHUB repository using the API
 * @ToDo : Maybe I'll expland this a bit in the future to do other stuff
 *         In any case it should be a basis for anyone else to be able to build off of
 * @copyright Copyright (c) 2010-Present, 061375
 * @author Jeremy Heminger <j.heminger@061375.com>
 * @bindings : jQuery
 * @deprecated = false
 *
 * */
var hasIssues = {
    private: {
        debugger:false,
        domain:'https://api.github.com/repos/',
        username:"",
        title:"Project Issues",
        forkit:' <span class="forkme"> hasIssues By <a href="http://061375.com/articles/view/Misc/20140222093714" rel="author">Jeremy Heminger</a> - Fork it on <a itemprop="url" href="https://github.com/061375/Display-Issues" target="_blank">GitHub</a></span>',
        display_forkit:true
    },
    init: function(obj) {
        if (typeof obj.debugger !== 'undefined') {
            this.private.debugger = obj.debugger;
        }
        if (typeof obj.domain !== 'undefined') {
            this.private.domain = obj.domain;
        }
        if (typeof obj.username !== 'undefined') {
            this.private.username = obj.username;
        }
        if (typeof obj.title !== 'undefined') {
            this.private.title = obj.title;
        }
        if (typeof obj.forkme !== 'undefined') {
            this.private.forkit = obj.forkit;
        }
        if (typeof obj.display_forkit !== 'undefined') {
            this.private.display_forkit = obj.display_forkit;
        }
    },
    /**
    * @method getIssues
    * @param project {String} : Name of the project to be displayed
    * @param target {String} : DOM element to be targetted
    *                          Use CSS selector standards
    */
    getIssues: function(project,target) {
        var $target = $(target);
        this.core.logThis('getIssues');
        var loader = document.createElement("div");
        $(loader).attr("class","loader");
        $(loader).html("Loading...Please Wait");
        $target.append(loader);
        this.core.logThis("getIssues");
        var url = this.private.domain+this.private.username+"/"+project+"/issues";
        var promise = this.core.getData(url);
        this.receiveIssues(promise,function(e) {
            $(loader).remove();
            hasIssues.buildIssueTable(e,target);
        });
    },
    receiveIssues: function(p,callback) {
        this.core.logThis('receiveIssues');
        var $return = [];
        p.done( function(data) {
            // let's just break this down to what we need
            var i = 0;
            $.each(data,function(k,v){
                hasIssues.core.logThis('receiveIssues '+v);
                $return[i] = {
                    title:v.title,
                    state:v.state,
                    body:v.body
                };
                i++;
            });
            if (typeof callback === "function") {
                callback($return);
            }
        }).fail(function(xhr, err){
            // display error in console
            hasIssues.core.logThis(xhr);
            hasIssues.core.logThis(err);
        });
    },
    buildIssueTable: function(issues,target) {
        var $target = $(target);
        hasIssues.core.logThis('buildIssueTable '+issues);
        var h2 = document.createElement("h2");
        $(h2).html(hasIssues.private.title);
        var table = document.createElement("table");
        $(table).attr("class","has_issues");
        var _table = '';
        $.each(issues,function(k,v) {
            _table += '<tr><td class="open pointer _title"><div class="hold_title">'+v.title+'</div><div class="chevron"><div class="chevron_l"></div><div class="chevron_r"></div></td></tr>';
            _table += '<tr class="hidden _body"><td>'+v.body+'</td></tr>';
        });
        $target.append(h2);
        $(table).html(_table);
        $target.append(table);
        if (hasIssues.private.display_forkit) {
            var p = document.createElement("p");
            $(p).html(hasIssues.private.forkit);
            $target.append(p);
        }
        hasIssues.core.logThis('buildIssueTable :: Append table '+$target.attr("id"));
        $target.on("click","._title",function(){
            $(this).parent('tr').next().toggle("fast");
        });
    },
    core:{
        getData: function(url) {
            $this = this;
            return jQuery.ajax({
                url      : url,
                type     : "get",
                dataType : "json"
            });
        },
        logThis:function(text){
            if (hasIssues.private.debugger == true) {
                if( (window['console'] !== undefined) ){
                    console.log( text );
                }
            }
        }
    }
}