/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";
var app = {
    peopleList: {},
    currentPage: "",
    currentPerson: null,
    // Application Constructor
    initialize: function() {
        (window.device) ?
            document.addEventListener('deviceready', app.onDeviceReady.bind(app), false) :
            document.addEventListener('DOMContentLoaded', app.onDeviceReady.bind(app), false);
        // document.addEventListener('deviceready', app.onDeviceReady.bind(app), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        window.addEventListener('push', app.pageChanged);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        
        app.currentPage = document.querySelector(".content").id;
        document.querySelector("#btn-ok-person").addEventListener("touchstart", app.savePerson);
        document.querySelector("#btn-close-person").addEventListener("touchstart", app.clickBtnClose);
    
        // localStorage.clear();
        try {
            if (!rscmLib.getLocalStorage().people) {
                localStorage.clear();
                rscmLib.setLocalStorage({people:[]});
            }
        }catch (err){
            rscmLib.setLocalStorage({people:[]});
        }
        
        app.showList(app.currentPage);
    },
    
    pageChanged: function(){
        //
        app.currentPage = document.querySelector(".content").id;
        console.log(app.currentPage);
        switch(app.currentPage) {
            case 'page-people':
                document.getElementById("add-person").addEventListener("touchstart", function () {
                    document.getElementById("btn-ok-person").addEventListener("touchstart", app.savePerson);
                    document.getElementById("btn-close-person").addEventListener("touchstart", app.clickBtnClose);
                });
                console.log('You are on '.concat(app.currentPage));
                break;
            case 'page-gifts':
                document.getElementById("add-gift").addEventListener("touchstart", function () {
                    document.getElementById("btn-ok-gift").addEventListener("touchstart", app.saveGift);
                    document.getElementById("btn-close-gift").addEventListener("touchstart", app.clickBtnClose);
                });
                console.log('You are on '.concat(app.currentPage));
                break;
            default:
                console.log('Page 404!')
        };

        app.showList(app.currentPage);
    },
    
    showList: function(page){
        //
        let ul = null;
        switch (page) {
            case 'page-people':
                //
                ul = document.getElementById("contact-list");
                ul.innerHTML = "";
        
                app.peopleList = rscmLib.getLocalStorage() || {"people": []};
                console.log(app.peopleList);
        
                app.peopleList.people.forEach(function (person) {
                    //
                    // let dob = moment(person.dob).
                    //
                    let li = rscmLib.createNewDOM({type: "li"   , class: "table-view-cell media", "data-id":person.id});
                    let s1 = rscmLib.createNewDOM({type: "span" , class: "name"});
                    let a1 = rscmLib.createNewDOM({type: "a"    , class: "edit-person", innerHTML: person.fullName, href: "#personModal"});
                    let a2 = rscmLib.createNewDOM({type: "a"    , class: "navigate-right pull-right", href: "gifts.html"});
                    let s2 = rscmLib.createNewDOM({type: "span" , class: "dob", innerHTML: person.dob });
                    //
                    s1.appendChild(a1);
                    a2.appendChild(s2);
                    li.appendChild(s1);
                    li.appendChild(a2);
                    ul.appendChild(li);
                    //
                    a1.addEventListener("touchstart",function (ev) {
                        //
                        console.log(ev.target.parentNode.parentNode.getAttribute("data-id"));
                        let personEdit = app.getPerson(ev.target.parentNode.parentNode.getAttribute("data-id"));
                        console.log(personEdit);
                        document.getElementById("fullName").value = personEdit[0].fullName;
                        document.getElementById("dateBirth").value = moment(personEdit[0].dob,"MMMM Do YYYY").format("YYYY-MM-DD");
                        app.currentPerson = personEdit[0].id;
                        //
                    });

                    a2.addEventListener("touchstart",function (ev) {
                        //
                        app.currentPerson = ev.target.parentNode.getAttribute("data-id");
                        console.log(app.currentPerson);
                        //
                    });
                    //
                });
                break;
            //
            case 'page-gifts':
                console.log("gifts' list");
                //
                let person = app.getPerson(app.currentPerson);
                console.log(person);
                ul = document.getElementById("gift-list");
                ul.innerHTML = "";
                //
                person[0].ideas.forEach(function (gift, index) {
                    //
                    let li = rscmLib.createNewDOM({type: "li"   , class: "table-view-cell media"});
                    let s1 = rscmLib.createNewDOM({type: "span" , class: "pull-right icon icon-trash midline", "data-id":index});
                    let dv = rscmLib.createNewDOM({type: "div"  , class: "media-body", innerHTML: gift.idea});
                    let p1 = rscmLib.createNewDOM({type: "p"    , innerHTML: gift.at});
                    let p2 = rscmLib.createNewDOM({type: "p"    });
                    let p3 = rscmLib.createNewDOM({type: "p"    , innerHTML: gift.cost});
                    let a1 = rscmLib.createNewDOM({type: "a"    , href: gift.url, target: "_blank", innerHTML: gift.url})
                    //
                    p2.appendChild(a1);
                    dv.appendChild(p1);
                    dv.appendChild(p2);
                    dv.appendChild(p3);
                    li.appendChild(s1);
                    li.appendChild(dv);
                    ul.appendChild(li);
                    //
                    s1.addEventListener("touchend", app.deleteGift);
                    //
                });
                //
                break;
        };
    },
    
    savePerson: function (ev) {
        ev.preventDefault();
        //
        app.peopleList = rscmLib.getLocalStorage() || {"people":[]};
        let person = {"id": Date.now(),
            "fullName": document.getElementById("fullName").value,
            "dob": moment(document.getElementById("dateBirth").value).format("MMMM Do YYYY"),
            "ideas":[]};
        console.log(app.peopleList);
        app.peopleList.people.push(person);
        rscmLib.setLocalStorage(app.peopleList);
        //
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        document.querySelector("#close-modal-person").dispatchEvent(myClick);
        //
        app.showList(app.currentPage);
        //
    },
    
    saveGift: function(ev){
        ev.preventDefault();
        //
        let person = app.getPerson(app.currentPerson);
        let gift = {"idea": document.getElementById("ideaDesc").value,
                    "at": document.getElementById("store").value,
                    "cost": document.getElementById("cost").value,
                    "url": document.getElementById("url").value};
        for (var i=0, size=app.peopleList.people.length; i<size; i++){
            if (app.peopleList.people[i].id === person[0].id) {
                app.peopleList.people[i].ideas.push(gift);
                break;
            }
        }
        rscmLib.setLocalStorage(app.peopleList);
        //
        document.querySelector(".input-group").reset();
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        document.getElementById("close-modal-gift").dispatchEvent(myClick);
        //
        app.showList(app.currentPage);
    },
    
    deleteGift: function (ev) {
        let person = app.getPerson(app.currentPerson);
        for (var i=0, size=app.peopleList.people.length; i<size; i++){
            if (app.peopleList.people[i].id === person[0].id) {
                app.peopleList.people[i].ideas = app.peopleList.people[i].ideas.filter(function (gift, index) {
                    return index.toString() !== ev.currentTarget.getAttribute("data-id");
                });
                break;
            }
        }
        rscmLib.setLocalStorage(app.peopleList);
        //
        app.showList(app.currentPage);
        //
    },
    
    clickBtnClose: function (){
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        try{
            document.querySelector(".input-group").reset();
            document.getElementById("close-modal-person").dispatchEvent(myClick);
        }catch (err){
            document.querySelector(".input-group").reset();
            document.getElementById("close-modal-gift").dispatchEvent(myClick);
        }
    },
    
    getPerson: function (id) {
        console.log(id);
        return app.peopleList.people.filter(function (person) {
            return person.id.toString() === id;
        });
    }
};

app.initialize();