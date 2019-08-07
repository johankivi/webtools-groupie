<template>
    <div class="container">
    <wtmenu/>
    <section id="input">
        <div class="group-length"><b>{{ nameListLength }}</b> namn i listan</div>
        <textarea id="name-list" v-model="updateList" @change="validateList"></textarea>
        <div class="group-name" @click="groupName = !groupName">
            <div id="input-group-name" :class="{ selected: groupName }"></div>
            <h3>Ge grupperna ett kickass gruppnamn!</h3>
        </div>
        <div class="group-leader" @click="groupLeader = !groupLeader">
            <div id="input-group-leader" :class="{ selected: groupLeader }"></div>
            <h3>Slumpa fram en gruppledare / grupp</h3>
        </div>
        <div id="group-style-members" @click="groupType = 0" :class="{ selected: groupType == 0 }">Medlemmar / grupp</div>
        <div id="group-style-groups" @click="groupType = 1" :class="{ selected: groupType == 1 }">Antal grupper</div>
        <div class="group-scale">
            <ul id="scale" @click="scale">
                <li><span :class="{ selected: groupSize == 2 }">2</span></li>
                <li><span :class="{ selected: groupSize == 3 }">3</span></li>
                <li><span :class="{ selected: groupSize == 4 }">4</span></li>
                <li><span :class="{ selected: groupSize == 5 }">5</span></li>
                <li><span :class="{ selected: groupSize == 6 }">6</span></li>
                <li><span :class="{ selected: groupSize == 7 }">7</span></li>
                <li><span :class="{ selected: groupSize == 8 }">8</span></li>
                <li><span :class="{ selected: groupSize == 9 }">9</span></li>
                <li><span :class="{ selected: groupSize == 10 }">10</span></li>
                <li><span :class="{ selected: groupSize == 11 }">11</span></li>
                <li><span :class="{ selected: groupSize == 12 }">12</span></li>
                <li><span :class="{ selected: groupSize == 13 }">13</span></li>
                <li><span :class="{ selected: groupSize == 14 }">14</span></li>
            </ul>
        </div>
        <a href="#" @click="go" id="create-groups">Slump me some groups</a>
    </section>
    <social/>
    </div>
</template>

<script>

import wtmenu from '@/components/Menu';
import social from '@/components/Social';

export default {
    name: 'wt-input',
    components: {
        wtmenu,
        social
    },
    data() {
        return {
            groupName: true,
            groupLeader: false,
            groupType: 0,
            groupSize: 2
        }
    },
    methods: {
        scale(e){
            this.groupSize = e.target.innerHTML;
        },
        go(){
            if(this.$store.state.nameList.length > 1){
            
                let data = {
                    groupName: this.groupName,
                    groupLeader: this.groupLeader,
                    groupSize: this.groupSize*1,
                    groupType: this.groupType,
                    nameList: this.$store.state.nameList
                }

                this.$store.commit('toggleState');
                this.$store.dispatch('submitGroupieForm', data);
                this.$router.push({name: 'wt-output'});
                
            } else {
        
                alert(`Skriv in några fler namn.`);
            
            }
            
        },
        validateList(){
            let list = this.$store.state.nameList;
            let arr = list.filter(entry => entry.trim() != '');
            let newList = arr.join(`\n`);
            this.$store.commit("updateNameList", newList);
        }
    },
    computed: {
        updateList: {
            get: function () {
                let list = this.$store.state.nameList;
                let newList = list.join(`\n`);
                return newList;
            },
            set: function (newValue) {
                this.$store.commit("updateNameList", newValue)
            }
        },
        nameListLength(){
            return this.$store.state.nameList.length;
        }
    }
}
</script>

<style>

.container {
    width:100vw;
    height: 100vh;
    display:flex;
}

#input {
    border-radius: 3px;
    width: 400px;
    box-sizing: border-box;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 40px 360px 40px 40px 40px 40px 80px;
    grid-template-areas: 
    "group-length group-length"
    "name-list name-list"
    "group-name group-name"
    "group-leader group-leader"
    "group-style-members group-style-groups"
    "scale scale"
    "create-groups create-groups";
}

#input .group-length {
        grid-area: group-length;
        color: rgba(255,255,255,.8);
        padding: 1rem .5rem;
        font-size: .8rem;
}

#name-list {
    grid-area: name-list;
    -webkit-appearance: none;
    border: none;
    resize: none;
    padding: 0 1rem;
    box-sizing: border-box;
    font-size: .8rem;
    line-height: 30px;
    height: 361px;
    width: 400px;
    background: #fff url('/static/row.png');
    background-attachment: local;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}


#name-list:focus {
    outline: none;
    -webkit-appearance: none;
}


#input h3 {
    margin: 0;
    padding: 0;
}

#input .group-name {
    grid-area: group-name;
    background: #E6E6E6;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 0 0 1rem;
}

#input .group-leader {
    grid-area: group-leader;
    background: #DBDBDB;
    display: flex;
    align-items: center;
    padding: 0 0 0 1rem;
}

#input-group-name, #input-group-leader {
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid #4B4A57;
    border-radius: 3px;
    margin: 0 1rem 0 0;
}

#input-group-name.selected, #input-group-leader.selected {
    background: #4B4A57 url('/static/icon-close-white.svg') no-repeat;
    background-size: 100%;
}

#input #group-style-members {
    grid-area: group-style-members;
    background: #CBCBCB;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-weight: 500;
}

#input #group-style-groups {
    grid-area: group-style-groups;
    background: #CBCBCB;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-weight: 500;
}

#group-style-groups:hover, #group-style-members:hover, .group-leader:hover, .group-name:hover {
    cursor: pointer;
}

#group-style-members.selected, #group-style-groups.selected {
    background: #4B4A57 !important;
    color: rgba(255,255,255,.8);
}

#group-style-members.selected:after, #group-style-groups.selected:after {
	top: 100%;
	left: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(0, 0, 0, 0);
	border-top-color: #4B4A57;
	border-width: 6px;
	margin-left: -6px;
}


#input .group-scale {
    grid-area: scale;
    background: #ADADAD;
}

#input .group-scale #scale {
    list-style: none;
    display: flex;
    height: 40px;
    margin: 0 0.5rem;
    padding: 0;
}

#input .group-scale #scale li {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .8rem;
}

#input .group-scale #scale li span {
    display: block;
    width: 17px;
    padding: 2px;
    text-align: center;
    border-radius: 999rem;
}

#input .group-scale #scale li span:hover {
    background: rgba(255,255,255,.2);
    cursor: pointer;
}

#input .group-scale #scale li span.selected {
    background: #4B4A57;
    color: white;
}


#input #create-groups {
    grid-area: create-groups;
    background: #4B4A57;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    color: rgba(255,255,255,.9);
    text-decoration: none;
    font-size: 1.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

#input #create-groups:hover {
    background: #313039;
}

#input #create-groups:active {
    background: rgba(0,0,0,1);
}

</style>
