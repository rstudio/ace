/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * The main class required to set up an Ace instance in the browser.
 *
 * @class Ace
 **/

define(function(require, exports, module) {
"use strict";

require("./lib/fixoldbrowsers");

// Force bundling of snippets
require("./snippets");
require("./snippets/_all_modes");
require("./snippets/abap");
require("./snippets/actionscript");
require("./snippets/ada");
require("./snippets/all_modes");
require("./snippets/apache_conf");
require("./snippets/applescript");
require("./snippets/asciidoc");
require("./snippets/assembly_x86");
require("./snippets/autohotkey");
require("./snippets/batchfile");
require("./snippets/c9search");
require("./snippets/c_cpp");
require("./snippets/cirru");
require("./snippets/clojure");
require("./snippets/cobol");
require("./snippets/coffee");
require("./snippets/coldfusion");
require("./snippets/csharp");
require("./snippets/css");
require("./snippets/curly");
require("./snippets/d");
require("./snippets/dart");
require("./snippets/diff");
require("./snippets/django");
require("./snippets/dockerfile");
require("./snippets/dot");
require("./snippets/dummy");
require("./snippets/dummy_syntax");
require("./snippets/eiffel");
require("./snippets/ejs");
require("./snippets/elixir");
require("./snippets/elm");
require("./snippets/erlang");
require("./snippets/forth");
require("./snippets/ftl");
require("./snippets/gcode");
require("./snippets/gherkin");
require("./snippets/gitignore");
require("./snippets/glsl");
require("./snippets/golang");
require("./snippets/groovy");
require("./snippets/haml");
require("./snippets/handlebars");
require("./snippets/haskell");
require("./snippets/haxe");
require("./snippets/html");
require("./snippets/html_ruby");
require("./snippets/ini");
require("./snippets/io");
require("./snippets/jack");
require("./snippets/jade");
require("./snippets/java");
require("./snippets/javascript");
require("./snippets/json");
require("./snippets/jsoniq");
require("./snippets/jsp");
require("./snippets/jsx");
require("./snippets/julia");
require("./snippets/latex");
require("./snippets/less");
require("./snippets/liquid");
require("./snippets/lisp");
require("./snippets/livescript");
require("./snippets/logiql");
require("./snippets/lsl");
require("./snippets/lua");
require("./snippets/luapage");
require("./snippets/lucene");
require("./snippets/makefile");
require("./snippets/markdown");
require("./snippets/mask");
require("./snippets/matlab");
require("./snippets/mel");
require("./snippets/mushcode");
require("./snippets/mushcode_high_rules");
require("./snippets/mysql");
require("./snippets/nix");
require("./snippets/objectivec");
require("./snippets/ocaml");
require("./snippets/pascal");
require("./snippets/perl");
require("./snippets/pgsql");
require("./snippets/php");
require("./snippets/plain_text");
require("./snippets/powershell");
require("./snippets/praat");
require("./snippets/prolog");
require("./snippets/properties");
require("./snippets/protobuf");
require("./snippets/python");
require("./snippets/r");
require("./snippets/rdoc");
require("./snippets/rhtml");
require("./snippets/ruby");
require("./snippets/rust");
require("./snippets/sass");
require("./snippets/scad");
require("./snippets/scala");
require("./snippets/scheme");
require("./snippets/scss");
require("./snippets/sh");
require("./snippets/sjs");
require("./snippets/smarty");
require("./snippets/snippets");
require("./snippets/soy_template");
require("./snippets/space");
require("./snippets/sql");
require("./snippets/stylus");
require("./snippets/svg");
require("./snippets/tcl");
require("./snippets/tex");
require("./snippets/text");
require("./snippets/textile");
require("./snippets/toml");
require("./snippets/twig");
require("./snippets/typescript");
require("./snippets/vala");
require("./snippets/vbscript");
require("./snippets/velocity");
require("./snippets/verilog");
require("./snippets/vhdl");
require("./snippets/xml");
require("./snippets/xquery");
require("./snippets/yaml");

var dom = require("./lib/dom");
var event = require("./lib/event");

var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var UndoManager = require("./undomanager").UndoManager;
var Renderer = require("./virtual_renderer").VirtualRenderer;

// The following require()s are for inclusion in the built ace file
require("./worker/worker_client");
require("./keyboard/hash_handler");
require("./placeholder");
require("./multi_select");
require("./mode/folding/fold_mode");
require("./ext/error_marker");
require("./ext/emmet");

exports.config = require("./config");

/**
 * Provides access to require in packed noconflict mode
 * @param {String} moduleName
 * @returns {Object}
 *
 **/
exports.require = require;

/**
 * Embeds the Ace editor into the DOM, at the element provided by `el`.
 * @param {String | DOMElement} el Either the id of an element, or the element itself
 *
 **/
exports.edit = function(el) {
    if (typeof(el) == "string") {
        var _id = el;
        el = document.getElementById(_id);
        if (!el)
            throw new Error("ace.edit can't find div #" + _id);
    }

    if (el && el.env && el.env.editor instanceof Editor)
        return el.env.editor;

    var value = "";
    if (el && /input|textarea/i.test(el.tagName)) {
        var oldNode = el;
        value = oldNode.value;
        el = dom.createElement("pre");
        oldNode.parentNode.replaceChild(el, oldNode);
    } else {
        value = dom.getInnerText(el);
        el.innerHTML = '';
    }

    var doc = exports.createEditSession(value);

    var editor = new Editor(new Renderer(el));
    editor.setSession(doc);

    var env = {
        document: doc,
        editor: editor,
        onResize: editor.resize.bind(editor, null)
    };
    if (oldNode) env.textarea = oldNode;
    event.addListener(window, "resize", env.onResize);
    editor.on("destroy", function() {
        event.removeListener(window, "resize", env.onResize);
        env.editor.container.env = null; // prevent memory leak on old ie
    });
    editor.container.env = editor.env = env;
    return editor;
};

/**
 * Creates a new [[EditSession]], and returns the associated [[Document]].
 * @param {Document | String} text {:textParam}
 * @param {TextMode} mode {:modeParam}
 * 
 **/
exports.createEditSession = function(text, mode) {
    var doc = new EditSession(text, mode);
    doc.setUndoManager(new UndoManager());
    return doc;
}
exports.EditSession = EditSession;
exports.UndoManager = UndoManager;
});
