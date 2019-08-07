import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// Vars
let a = [],
b = [],
c = [],
newArr = [],
groups = [];


export default new Vuex.Store({
  state: {
    showGroups: false,
    groupieObj: [],
    nameList: [],
    activeSettings: {},
    stateOutput: false,
    activeGroupie: {}
  },
  mutations: {
    setGroupieObj(state, data){
      this.state.groupieObj = data;
    },
    removeGroup(state, index){
      let arr = this.state.groupieObj;
      arr.splice(index, 1);
      localStorage.setItem('groupie', JSON.stringify(arr));
    },
    updateGroupieObj(state, data){
      let arr = this.state.groupieObj;
      arr.push(data);
      localStorage.setItem('groupie', JSON.stringify(arr));
    },
    updateNameList(state, arr){
      let newArr = arr.split(`\n`);
      this.state.nameList = newArr;
    },
    toggleShowGroups(state){
      this.state.showGroups = !this.state.showGroups;
    },
    toggleState(state){
      this.state.stateOutput = !this.state.stateOutput;
    },
    setActiveGroupie(state, obj){
      this.state.activeGroupie = obj;
    },
    updateActiveNameList(state, Arr){
      this.state.activeGroupie.nameList = Arr;
    }
  },
  actions: {
    submitGroupieForm(context, data){

      // Store settings
      this.state.activeSettings.groupLeader = data.groupLeader;
      this.state.activeSettings.groupName = data.groupName;
      this.state.activeSettings.groupSize = data.groupSize;
      this.state.activeSettings.groupType = data.groupType;


      // 1. get list
      let list = data.nameList;

      // 2. Separate
      list.forEach(member => {
        
        if(member.includes('   ')){
            b.push(member.trim());
        } else {
            a.push(member);
        }

      })

      // 3. Calc groupSize
      const groupsize = groupType(data.groupType, data.groupSize, a.concat(b));

      // 4. Match b to groupSize
      if(b.length > Math.ceil(a.concat(b).length / groupsize)) {
        
        let toMany = b.length % Math.ceil(a.concat(b).length / groupsize);
        
        for(let i = 0; i < toMany; i++ ){
            a.push(b.pop());
        }

      }

      shuffle(a);

      // 5. Insert ev. b into groupSize:th
      for(let i=0, j=(a.length+b.length); i < j; i++){

        if(i % groupsize == 0){
            
            if(b.length > 0 ) {
                c.push(b.shift());
            } else {
                c.push(a.shift());
            }

        } else {
            c.push(a.shift());
        }

      }

      // 6. chunk it
      chunk(c, groupsize);
      
      // 7. Balance
      if(groups[groups.length-1].length < Math.ceil(groupsize * .75)){

        // 1. Pop it
        let left = groups.pop();

        // Push it in other groups
        for(let i=0; i<groups.length; i++){
            if(left.length > 0 ){
                groups[i].push(left.pop())
            }
        }

      }

      // 8. shuffle groups
      groups.forEach((group, i) => {
          
          
          // 8.1 Shuffle it
          shuffle(group);

          // 8.2 if leader
          if(data.groupLeader){
              let randNr = Math.floor(Math.random()*group.length);
              group[randNr] = `*${group[randNr]}`; 
          }
  
          // Group name or number
          function grName(){
             if(data.groupName){
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

      // 9. Commit active Groupie

      let newGroupie = {
        name: null,
        groups: newArr
      }

      context.commit('setActiveGroupie', newGroupie)

    },
    generateCrossGroups(context, arr){

      let crossGroupsArr = [];
            
      for(let n=0, m=arr.groups[0].groupMembers.length; n < m; n++){
          
          let y = {
              name: `Tvärgrupp ${n+1}`,
              members: []
          }

          arr.groups.forEach((v,i) => {
              if(v.groupMembers[n]){
                  y.members[i] = v.groupMembers[n].replace(`*`,``);
              }
          })
          crossGroupsArr.push(y);
      }

      let newGroupie = {
          name: `Tvärgrupper`,
          groups: crossGroupsArr
      }

      // Commit 
      context.commit('setActiveGroupie', newGroupie)

    },
    remixGroups(context, group){
      
      let data = {
        groupName: this.state.activeSettings.groupName,
        groupLeader: this.state.activeSettings.groupLeader,
        groupSize: this.state.activeSettings.groupSize,
        groupType: this.state.activeSettings.groupType,
        nameList: shuffle(group)
      }

      this.dispatch('submitGroupieForm', data)
      
    }
  }
});

/* GLOBAL FUNCTIONS */
function groupType(type, groupSize, arr) {

  // Members per group
  if(type === 0){
      return groupSize;
  }

  // No of groups
  if(type === 1){
      return Math.ceil(arr.length / groupSize);
  }

  // Cross group
  if(type === 2){

  }

}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
};

function chunk(arr, size){

  let i,j,temparray;

  for (let i=0,j=arr.length; i<j; i+=size) {
      temparray = arr.slice(i,i+size);
      groups.push(temparray);
  }

}

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