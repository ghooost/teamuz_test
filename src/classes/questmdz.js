import Quest from './quest';
export default class QuestMdz extends Quest {
  constructor(){
    super();
    this.stages.CONTINUE='continue';
    this.stages.VOTES='votes';
    this.state.version="QuestMdz";
  }

  static quest(node,data){
    return new QuestMdz().apply(node,data);
  }

  doAction(command,data){
    try{
      switch(command){
        case this.stages.QUEST:
          this.state.stage=this.stages.VOTES;
          this.state.answers[data.questId]=data.answerId;
          this.state.data.quests[data.questId].votes++;
        break;
        case this.stages.CONTINUE:
          if(this.state.answers.length==this.state.data.quests.length){
            this.state.stage=this.stages.RESULT;
//calc results
            this.calcResults();
          } else {
            this.state.stage=this.stages.QUEST;
          }
        break;
        default:
          super.doAction(command,data);
      }
    } catch(err){
      console.log(err);
      this.state.stage=this.stages.ERROR;
      this.state.errMes=err.message;
    }
    this.reDraw();
  }

  drawVotes(){
    let data=this.state.data;
    let questId=this.state.answers.length-1;
    let quest=data.quests[questId];
    let answer=this.state.answers[questId];
    let validAnswer=this.state.data.results.valid[questId];

    let page=this.mk({cls:"page",node:this.state.node});
    this.mk({cls:"title",html:data.title,node:page});
    this.mk({cls:"note",html:quest.note,node:page});

    let total=quest.answers.reduce((a,b)=>{
      return a+b.votes;
    },0);

    let percents=100;

    quest.answers.forEach((item,index,arr)=>{
      let vote=this.mk({node:page})
      let cls=['vote'];
      this.mk({cls:"note",html:item.note,node:vote});
      let statHtml='';
      if(total>0){
        let locPercents=(index<arr.length-1)?parseInt(item.votes/total*100):percents;
        percents-=locPercents;
        statHtml=locPercents+"%";
      };

      this.mk({cls:"stat",html:statHtml,node:vote});

      if(index==answer){
          this.mk({cls:"text",html:item.text,node:vote});
          cls.push('active');
      };

      if(index==validAnswer){
        cls.push('valid');
      } else {
        if(index==answer){
          cls.push('invalid');
        };
      };
      vote.className=cls.join(' ');
    });

    let buttons=this.mk({cls:"buttons",node:page});
    this.mk({tag:"a",cls:"button",html:data.continue,node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.CONTINUE),false);
  }


  reDraw(){
    this.zero();
    switch(this.state.stage){
      case this.stages.VOTES:
        this.drawVotes();
      break;
      default:
        super.reDraw();
    }
  }

}
