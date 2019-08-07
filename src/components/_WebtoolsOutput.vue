<template>
     <div class="container">
        <wtmenu @do="proxy"/>
        <section id="output">
            <section class="card-container">
                <article v-for="(group, index) in activeGroupie.groups" class="card-group">
                    <h1 class="card-title">
                        <span class="pick-member" @click="pickRandomMember">Slumpa namn inom grupp</span>
                        <span>{{ group.name }}</span>                        
                    </h1>
                    <draggable class="card-members" :options="{group:'member'}" @remove="removeCard">
                            <div class="member" v-for="member of group.members" :key="member" @click="removeMember">{{ member }}</div>
                    </draggable>
                </article>
            </section>
        </section>
    </div>
</template>

<script>

import wtmenu from '@/components/Menu';
import html2canvas from 'html2canvas';
import draggable from 'vuedraggable';

export default {
    name: 'wt-output',
    components: {
        wtmenu,
        draggable
    },
    data(){
        return {
            activeGroup: null,
            remove: false
        }
    },
    methods:{
        proxy(e){
           if (e === `remix`) { this.remix(); }
           if (e === `cross`) { this.crossGroups(); }
           if (e === `screenshot`) { this.takeScreenshot(); }
          // if (e === `link`) { this.createLink(); }
        },
        pickRandomMember(e){

            let parent = e.srcElement.parentElement.parentElement;
            let childs = parent.querySelectorAll(`.member`);
            
            for(let child of childs){
                child.classList.remove(`picked`);
            }

            let slump = Math.floor(Math.random()*childs.length);
            childs[slump].classList.add(`picked`);

        },
        removeMember(e){

            if(e.altKey){
                e.srcElement.remove();
            };

        },
        collectMembers(){
            
            let collectedMembers = [];
            let members = document.querySelectorAll('.member');
            
            for(let member of members){
                collectedMembers.push(member.innerHTML.replace(`*`,``));
            }

            return collectedMembers;

        },
        collectGroups(){
            
            let collectedGroupie = {
                groupieName: `GroupieObj`,
                groups: []
            };

            let groups = document.querySelectorAll(`.card-group`);
            
            for(let group of groups){

                let title = group.querySelector('.card-title span:last-child').innerHTML;
                let members = group.querySelectorAll('.member');

                let tempGroup = {
                    groupName: title,
                    groupMembers: [] 
                };

                for(let member of members){
                    tempGroup.groupMembers.push(member.innerHTML);
                };

                collectedGroupie.groups.push(tempGroup);
            }

            return collectedGroupie;
        
        },
        remix(){

            let groupie = this.$store.state.activeGroupie;

             let data = {
                groupName: groupie.groupName,
                groupLeader: groupie.groupLeader,
                groupSize: groupie.groupSize*1,
                groupType: groupie.groupType,
                nameList: shuffle(this.collectMembers())
            }

            // Add animation
            let cardGroup = document.querySelectorAll('.card-group');
            
            for(let card of cardGroup){
                card.classList.add(`zoom`);
            }

            setTimeout(()=>{
                let cardGroup = document.querySelectorAll('.card-group');
            
                for(let card of cardGroup){
                    card.classList.remove(`zoom`);
                }

            },300);

            this.$store.commit('setActiveGroupie', data);

        },
        crossGroups(){

            let groups = this.collectGroups();
            let crossGroupsArr = [];
            
            for(let n=0, m=groups.groups[0].groupMembers.length; n<m; n++){
                
                let y = {
                    name: `Tvärgrupp ${n+1}`,
                    members: []
                }

                groups.groups.forEach(function(v,i) {
                    if(v.groupMembers[n]){
                        y.members[i] = v.groupMembers[n].replace(`*`,``);
                    }
                })
                crossGroupsArr.push(y);
            }

            let data = {
                groupType: 2,
                groupName: true,
                groupSize: groups.groups[0].groupMembers.length,
                name: `Tvärgrupper`,
                groups: crossGroupsArr
            }

            this.$store.commit('setActiveGroupie', data);

        },
        takeScreenshot(){

            let now = Date.now();
            
            html2canvas(document.querySelector(`.card-container`),{
                background: `#A66FC7`,
                onrendered:(canvas) => {
                    let a = document.createElement('a');
                    a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    a.download = `${now}_groupie.jpg`;
                    a.click();
                } 
            });

        },
        removeCard(e){
            
            if(e.from.childElementCount < 1){
                e.from.parentElement.remove();
            };

        },
        createLink(){
            let obj = this.collectGroups();
            let name = prompt(`Döp din Groupie`);
            obj.groupieName = name; 
        }
    },
    computed: {
        activeGroupie(){ 
            let groupie = this.$store.state.activeGroupie;
            if(groupie.groupType === 2){
                return groupie;
            } else {
                let resp = generateGroups(groupie);
                return resp;
            }
        }
    }
};


/* GLOBAL FUNCTIONS */
function generateGroups(groupie){

    let groupSize,
        newArr = [];

    if(groupie.groupType === 0) {
        groupSize = (groupie.nameList.length / groupie.groupSize).toFixed();
    } 
    
    if(groupie.groupType === 1) {
        groupSize = groupie.groupSize;
    }

    // Shuffle
    shuffle(groupie.nameList);

    // Loop the group
    let groups = chunk(groupie.nameList, groupSize, true)

    // Add name and leader
    groups.forEach((group, i)=>{

        // if leader
        if(groupie.groupLeader){
            let randNr = Math.floor(Math.random()*group.length);
            group[randNr] = `*${group[randNr]}`; 
        }

        // Group name or number
        function grName(){
           if(groupie.groupName){
               return getGroupName().pop()
            } else { 
                return `Grupp ${i+1}` 
            }
        };
        
        let gr = {
            name: grName(),
            members: group 
        }

        newArr.push(gr);

    });

    return {
        name: null,
        groups: newArr
        }
};


// Fisher Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};


// Group names
function getGroupName() {
	
    let prefix = ["Super","Ninja","Bunny","Robo","Ultra","Power","Speedy","Crazy","Bionic","Space","Ghost","Kung-Fu","Happy","Smooth","Fire","Smart","Poop","Mega","Mad","Majestic","Mighty","Cool","Diamond","Fabulous","Fantastic","Furious","Golden","Silver","Iron","Magic","Ruby","Pink","Crypto","War","Spicy","Curly"];
    let suffix = ["Zebras","Bananas","Rabbits","Zombies","Rangers","Sheriffs","Knights","Vikings","Ninjas","Turtles","Monkeys","Pants","Gardeners","Guardians","Masters","Astronauts","Experts","Poopers","Fighters","Stars","Criminals","Rollers","Pirates","Surfers","Warriors","Nerds","Scientists","Unicorns","Dolphins","Kittens"];
            
    let names = []; 

    for(let i=0, j=prefix.length; i < j; i++){
       
        for(let k=0, l=suffix.length; k < l; k++){
            names.push(`${prefix[i]} ${suffix[k]}`);
        }      
    }

    return shuffle(names);
};

function chunk(a, n, balanced) {
    
    if (n < 2)
        return [a];

    let len = a.length,
            out = [],
            i = 0,
            size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n))

    }

    return out;
};

</script>

<style>

#output {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    position: absolute;
}

.card-container {
    width: 800px;
    margin: auto;
    display: grid;
    padding: 1rem;
    grid-template-columns: repeat(3, 1fr);
    grid-gap:1rem;
}

.card-group {
    background: white;
    border-radius: 3px;
    box-shadow: 3px 3px 20px rgba(0,0,0,.05);
}

.card-group.zoom {
    animation: minizoom .2s ease;
    animation-fill-mode: forwards;
}

@keyframes minizoom {
    0% { transform:scale(1.2); opacity: 0; }
    100% { transform:scale(1); opacity: 1; }
}

.card-group.edit .card-title {
    background: #EB6A6A;
}

.card-title {
    margin: 0;
    padding: 0 1rem;
    background: #4B4A57;
    color: rgba(255,255,255,1);
    height: 3rem;
    font-size: 1.2rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    position: relative;
}
.card-title span {
    display: inline-block;
    position: absolute;
}

.card-title .pick-member {
    width: 100%;
    height: 100%;
    background: #25252B;
    z-index: 9;
    font-size: .8rem;
    font-weight: 300;
    align-items: center;
    justify-content: center;
    display: none;
}

.card-title:hover .pick-member {
display: flex;
cursor: pointer;
}

.card-members {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-content: stretch;
}

.card-members .member {
    padding: .5rem 1.5rem;
    border-bottom:1px solid rgba(0,0,0,.05);
    color: #555;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: .8rem;
}


.card-members .member:hover {
    cursor: grab;
}

.card-members .member:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px; 
}


.sortable-chosen, .sortable-ghost {
    background: rgba(235,106,106,.25) !important;
    cursor: grabbing !important;
}

.picked {
    font-weight: 600;
    color: #63506F !important;
}


</style>
