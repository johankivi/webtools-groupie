<template>
    <aside id="overlay">
        <a href="#" id="close" @click="closeOverlay"><img src="/static/icon-close.svg" alt="close"></a>
        <main class="centercontainer">
            <a href="#" id="add-group" @click="saveGroup">Spara grupp</a>
            <section class="grid-container">
                <article v-for="(group, index) in savedGroups">
                    <h1 @click="populateNameList(index)">{{ group.groupName }}</h1>
                    <h2 @click="populateNameList(index)"> {{ group.groupMembers.length }} medlemmar</h2>
                    <a href="#" class="remove-group" @click="removeListItem(index)">Ta bort</a>
                </article>
            </section>
        </main>
    </aside>
</template>

<script>
export default {
    name: 'overlay',
    data(){
        return {
            groupie: false
        }
    },
    beforeCreate(){
        // Get groupieData
        if(localStorage.getItem(['groupie'])){
            this.groupie = true;
            this.$store.commit(`setGroupieObj`, JSON.parse(localStorage.getItem('groupie')))
            let x = this.$store.state.groupieObj;
        } else {
            console.error(`Hittar inget Groupie-objekt.`);	
        }
    },
    methods:{
        populateNameList(index){
            let obj = this.$store.state.groupieObj[index];
            let arr = obj.groupMembers;

            this.$store.commit("updateNameList", arr.join(`\n`));
            this.closeOverlay();
        },
        removeListItem(index){
            let q = confirm(`Vill du verkligen ta bort gruppen?`);
            if(q !== false){
                this.$store.commit(`removeGroup`, index);
            }
        },
        saveGroup(){

            if(this.$store.state.nameList.length > 1){

                let name = prompt(`Döp gruppen`);
                
                if (name !== null) {

                    let obj = {
                        groupName: name,
                        groupMembers: this.$store.state.nameList
                    }

                    this.$store.commit(`updateGroupieObj`, obj);     
            
                }

            } else {
                alert(`Textrutan är tom!`);
            }

       },
        closeOverlay(){
            this.$store.commit(`toggleShowGroups`);
        }
    },
    computed: {
        savedGroups(){
            return this.$store.state.groupieObj;        
        }
    }
}
</script>

<style>


aside#overlay {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,1);
    z-index: 99;
    display: flex;
}

aside#overlay a#close {
    display: block;
    width: 2rem;
    height: 2rem;
    background: rgba(255,255,255,.8);
    padding: .6rem;
    margin: 2rem;
    border-radius: 999em;
    position: absolute;
}

aside#overlay a#close:hover {
    background: rgba(255,255,255,1);
}


aside#overlay .centercontainer {
    margin: auto;
}


aside#overlay a#add-group {
    color: white;
    width: 120px;
    height: 30px;
    border:1px solid white;
    padding: .75rem 2rem;
    text-align: center;
    display: block;
    margin: 0 0 2rem 0;
    font-size: 1.2rem;
    text-decoration: none;
    border-radius: 3px;
}

aside#overlay a#add-group:hover {
    background: white;
    color: #222;
}

.remove-group {
    display: inline-block;
    margin: .75rem 0 0 0;
    padding: 3px 6px;
    text-decoration: none;
    color: rgba(255,255,255,.6);
}

.remove-group:hover {
    display: inline-block;
    margin: .75rem 0 0 0;
    text-decoration: none;
    color: rgba(0,0,0,1);
    background: #EB6A6A;
    border-radius: 3px;
}

aside#overlay .grid-container {
    display: grid;
    grid-template-columns: repeat(3, minmax(240px, auto));
    grid-auto-rows: 120px;
    grid-gap: 1rem;
}

aside#overlay article {
    padding: 1rem;
    opacity: .6;
}

aside#overlay article:hover {
    opacity: 1;
    cursor: pointer;
}

aside#overlay article h1 {
    color: white;
    margin: 0;
    padding: 0;
    font-size: 1.7rem;
}

aside#overlay article h2 {
    color: rgba(255,255,255,.6);
    margin: 0;
    padding: 0;
    font-weight: 200;
    font-size: 1rem;
}

</style>
