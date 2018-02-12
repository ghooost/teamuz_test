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
    let frame=this.mk({cls:"frame",node:this.state.node});
    let content=this.mk({cls:"content",node:frame});
    let page=this.mk({cls:"page intro",node:content});
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
    let frame=this.mk({cls:"frame",node:this.state.node});
    let content=this.mk({cls:"content",node:frame});
    let page=this.mk({cls:"page question",node:content});
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
    let frame=this.mk({cls:"frame",node:this.state.node});
    let content=this.mk({cls:"content",node:frame});
    let page=this.mk({cls:"page result",node:content});
    this.mk({cls:"title",html:data.title,node:page});
    this.mk({cls:"count",html:this.state.result.count,node:page});
    this.mk({cls:"note",html:this.state.result.note,node:page});

    let buttons=this.mk({cls:"buttons",node:page});

    if(data.share){
      let shares=buttons;
      let url=window.location+'?skey='+this.state.result.share;

      if(data.shareLabel){
        this.mk({cls:"share-label",node:shares,html:data.shareLabel});
      };

      let link=this.mk({tag:"a",cls:"fb share",node:shares});
      link.addEventListener("click",this.share.bind(this,url,'fb'),false);

      link=this.mk({tag:"a",cls:"tw share",node:shares});
      link.addEventListener("click",this.share.bind(this,url,'tw'),false);

      link=this.mk({tag:"a",cls:"vk share",node:shares});
      link.addEventListener("click",this.share.bind(this,url+"&vk=1",'vk'),false);
    }

    this.mk({tag:"a",cls:"button",html:data.restart,node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.INIT),false);
  }

  share(url,service){
    switch(service){
      case 'fb':
        url='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);
      break;
      case 'tw':
        url='https://twitter.com/share?url='+encodeURIComponent(url);
      break;
      case 'vk':
        url='https://vk.com/share.php?url='+encodeURIComponent(url);
      break;
    }
    let win=window.open(url,'sharewindow','width=600,height=500,status=0');
    win.focus();
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
