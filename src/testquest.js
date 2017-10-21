import * as EncLoader from 'json-unreadable-loader';
import QuestGuess from './classes/questguess.js';
let Buffer = require('safe-buffer').Buffer;
let data=EncLoader.decode(require('json-unreadable-loader!./data/testquestguess.json'));
let nodes=document.querySelectorAll('[data-quest="testquest"]');
let quests=[];
for(let cnt=0,m=nodes.length;cnt<m;cnt++){
  quests.push(QuestGuess.quest(nodes[cnt],data));
};
