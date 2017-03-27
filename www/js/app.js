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
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false) :
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
        // document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
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
        
        this.currentPage = document.querySelector(".content").id;

        document.querySelector("#btn-ok-person").addEventListener("touchstart", this.saveNew);
        document.querySelector("#btn-close-person").addEventListener("touchstart", this.clickBtnClose);
    
        // localStorage.clear();
        try {
            if (!rscmLib.getLocalStorage().people) {
                localStorage.clear();
                rscmLib.setLocalStorage({people:[]});
            }
        }catch (err){
            rscmLib.setLocalStorage({people:[]});
        }
        
        this.showList(this.currentPage);
    },
    
    pageChanged: function(){
        //
        this.currentPage = document.querySelector(".content").id;
        console.log(this.currentPage);
        switch(this.currentPage) {
            case 'page-people':
                document.querySelector("#btn-ok-person").addEventListener("touchstart", this.clickBtnClose);
                document.querySelector("#btn-close-person").addEventListener("touchstart", this.clickBtnClose);
                
                console.log('You are on '.concat(this.currentPage));
                break;
            case 'page-gifts':
                document.querySelector("#btn-ok-gift").addEventListener("touchstart", this.clickBtnClose);
                document.querySelector("#btn-close-gift").addEventListener("touchstart", this.clickBtnClose);

                console.log('You are on '.concat(this.currentPage));
                break;
            default:
                console.log('Page 404!')
        };
        //
        app.showList(this.currentPage);
    },
    
    showList: function(page){
        //
        let ul = null;
        switch (page) {
            case 'page-people':
                //
                ul = document.getElementById("contact-list");
                ul.innerHTML = "";
        
                this.peopleList = rscmLib.getLocalStorage() || {"people": []};
                console.log(this.peopleList);
        
                this.peopleList.people.forEach(function (person) {
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

                });
                break;
            //
            case 'page-gifts':
                console.log("gifts' list");
                //
                let person = this.getPerson(app.currentPerson);
                console.log(person);
                ul = document.getElementById("gift-list");
                ul.innerHTML = "";
                //
                person[0].ideas.forEach(function (gift) {
                    //
                    let li = rscmLib.createNewDOM({type: "li"   , class: "table-view-cell media"});
                    let s1 = rscmLib.createNewDOM({type: "span" , class: "pull-right icon icon-trash midline"});
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
                });
                //
                break;
        };
    },
    
    saveNew: function(ev){
        ev.preventDefault();
        //
        this.peopleList = rscmLib.getLocalStorage() || {"people":[]};
        let person = {"id": Date.now(),
                      "fullName": document.getElementById("fullName").value,
                      "dob": moment(document.getElementById("dateBirth").value).format("MMMM Do YYYY"),
                      "ideas":[]};
        console.log(this.peopleList);
        this.peopleList.people.push(person);
        rscmLib.setLocalStorage(this.peopleList);
        //
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        document.querySelector("#close-modal-person").dispatchEvent(myClick);
        //
        location.reload();
        //
    },
    
    saveGift: function(ev){
        ev.preventDefault();
        //
        this.peopleList = rscmLib.getLocalStorage() || {"people":[]};
        let person = {"id": Date.now(),
            "fullName": document.getElementById("fullName").value,
            "dob": moment(document.getElementById("dateBirth").value).format("MMMM Do YYYY"),
            "ideas":[]};
        console.log(this.peopleList);
        this.peopleList.people.push(person);
        rscmLib.setLocalStorage(this.peopleList);
        //
        document.querySelector(".input-group").reset();
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        document.querySelector("#close-modal-person").dispatchEvent(myClick);
        //
        location.reload();
        //
    },
    
    clickBtnClose: function (ev){
        let myClick = new CustomEvent('touchend', { bubbles: true, cancelable: true });
        try{
            document.querySelector(".input-group").reset();
            console.log("person");
            document.querySelector("#close-modal-person").dispatchEvent(myClick);
        }catch (err){
            console.log("gift");
            document.querySelector("#close-modal-gift").dispatchEvent(myClick);
        }
    },
    
    getPerson: function (id) {
        console.log(id);
        return this.peopleList.people.filter(function (person) {
            return person.id.toString() === id;
        });
    }
};

app.initialize();