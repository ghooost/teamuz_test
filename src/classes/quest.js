export default class Quest{
  constructor(){
    this.stages={
      INIT:'init',
      START:'start',
      QUEST:'quest',
      RESULT:'result',
      ERROR:'error',
      LOADING:'loading'
    };
    this.state={
      stage:'',
      version:'Quest',
      node:null,
      data:null
    };
  }

  static quest(node,data){
    return new Quest().apply(node,data);
  }

  apply(node,data){
    this.state.node=node;
    this.state.data=data;
    this.doAction(this.stages.INIT);
  }

  doAction(command,data){
    try{
      switch(command){
        case this.stages.INIT:
          if(!this.state.data){
            throw new Error("Невозможно найти данные");
          };
          if(this.state.data.version!=this.state.version){
            throw new Error("Неправильная версия данных: "+this.state.data.version+" вместо "+this.state.version);
          };
          if(!this.state.data.quests.length){
            throw new Error("Не заданы вопросы");
          };
          this.state.stage=this.stages.INIT;
        break;
        case this.stages.START:
          this.state.answers=[];
          this.state.stage=this.stages.QUEST;
        break;
        case this.stages.QUEST:
          this.state.answers[data.questId]=data.answerId;
          if(this.state.answers.length==this.state.data.quests.length){
            this.state.stage=this.stages.RESULT;
//calc results
            this.calcResults();
          } else {
            this.state.stage=this.stages.QUEST;
          }
        break;
      }
    } catch(err){
      console.log(err);
      this.state.stage=this.stages.ERROR;
      this.state.errMes=err.message;
    }
    this.reDraw();
  }

  calcScore(checkArr,factArr){
    let ret=0;
    checkArr.forEach((item,itemId)=>{
      if(factArr[itemId]==item){
        ret++;
      };
    });
    return ret;
  }


  calcResults(){
    let score=this.calcScore(this.state.data.results.valid,this.state.answers);
    let results=this.state.data.results.variants.filter(item=>{
      return (item.max>=score && item.min<=score);
    });
    if(!results.length){
      throw new Error("Похоже, нет подходящего варианта");
    } else {
      this.state.result=results[0];
      this.state.result.count=score+" / "+this.state.data.results.valid.length;
    }
  }

  drawInit(){
    let data=this.state.data;
    let page=this.mk({cls:"page intro",node:this.state.node});
    this.mk({cls:"title",html:data.title,node:page,tag:data.titleTag?data.titleTag:'div'});
    if(data.subtitle) this.mk({cls:"subtitle",html:data.subtitle,node:page});
    this.mk({cls:"note",html:data.note,node:page});
    let buttons=this.mk({cls:"buttons",node:page});
    this.mk({tag:"a",cls:"button",html:data.start,node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.START),false);
  }

  drawQuest(){
    let data=this.state.data;
    let questId=this.state.answers.length;
    let quest=data.quests[questId];
    let page=this.mk({cls:"page",node:this.state.node});
    this.mk({cls:"title",html:data.title,node:page,tag:data.titleTag?data.titleTag:'div'});
    this.mk({cls:"note",html:quest.note,node:page});
    let answers=this.mk({cls:"answers",node:page});
    quest.answers.forEach((item,index)=>{
      this.mk({tag:"a",cls:"answer",html:item.note,node:answers})
      .addEventListener("click",this.doAction.bind(this,this.stages.QUEST,{
        questId:questId,
        answerId:index
      }),false);
    });
  }

  drawResults(){
    let data=this.state.data;
    let page=this.mk({cls:"page result",node:this.state.node});
    this.mk({cls:"title",html:data.title,node:page});
    this.mk({cls:"subtitle",html:this.state.result.count,node:page});
    this.mk({cls:"note",html:this.state.result.note,node:page});
    let buttons=this.mk({cls:"buttons",node:page});
    this.mk({tag:"a",cls:"button",html:data.restart,node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.INIT),false);
  }

  drawError(){
    let data=this.state.data;
    let page=this.mk({cls:"page error",node:this.state.node});
    this.mk({class:"note",html:this.state.errMes,node:page});
    let buttons=this.mk({cls:"buttons",node:page});
    this.mk({tag:"a",cls:"button",html:(data && data.restart)?data.restart:"Начать сначала",node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.INIT),false);
  }

  reDraw(){
    this.zero();
    switch(this.state.stage){
      case this.stages.INIT:
        this.drawInit();
      break;
      case this.stages.QUEST:
        this.drawQuest();
      break;
      case this.stages.RESULT:
        this.drawResults();
      break;
      case this.stages.ERROR:
        this.drawError();
      break;
    }
  }

  mk(options={}){
    const defOpt={
      tag:"div",
      cls:"",
      html:"",
      node:null
    };
    let o=Object.assign({},defOpt,options);
    let d=document.createElement(o.tag);
    d.className=o.cls;
    d.insertAdjacentHTML('afterbegin',o.html);
    if(o.node){
      o.node.appendChild(d);
    };
    return d;
  }

  zero(){
    while(this.state.node.firstChild){
      this.state.node.removeChild(this.state.node.firstChild);
    }
  }
}
