import * as EncLoader from 'json-unreadable-loader';

let quests=[];
let Buffer = require('safe-buffer').Buffer;
let data,nodes;


import Quest from './classes/quest.js';
data=EncLoader.decode(require('json-unreadable-loader!./data/crnp.json'));
nodes=document.querySelectorAll('[data-quest="crnp"]');
for(let cnt=0,m=nodes.length;cnt<m;cnt++){
  quests.push(Quest.quest(nodes[cnt],data));
};
