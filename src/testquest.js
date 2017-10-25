import * as EncLoader from 'json-unreadable-loader';

let quests=[];
let Buffer = require('safe-buffer').Buffer;
let data,nodes;


import Quest from './classes/quest.js';
data=EncLoader.decode(require('json-unreadable-loader!./data/testquest.json'));
nodes=document.querySelectorAll('[data-quest="quest"]');
for(let cnt=0,m=nodes.length;cnt<m;cnt++){
  quests.push(Quest.quest(nodes[cnt],data));
};


import QuestGuess from './classes/questguess.js';
data=EncLoader.decode(require('json-unreadable-loader!./data/testquestguess.json'));
nodes=document.querySelectorAll('[data-quest="questguess"]');
for(let cnt=0,m=nodes.length;cnt<m;cnt++){
  quests.push(QuestGuess.quest(nodes[cnt],data));
};


import QuestMdz from './classes/questmdz.js';
data=EncLoader.decode(require('json-unreadable-loader!./data/testquestmdz.json'));
nodes=document.querySelectorAll('[data-quest="questmdz"]');
for(let cnt=0,m=nodes.length;cnt<m;cnt++){
  quests.push(QuestMdz.quest(nodes[cnt],data));
};
