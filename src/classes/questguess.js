import Quest from './quest';
export default class QuestGuess extends Quest {
  constructor(){
    super();
    this.state.version="QuestGuess";
  }
  static quest(node,data){
    return new QuestGuess().apply(node,data);
  }

  calcResults(){
    let results=this.state.data.results.map((variant,variantId)=>{
      return {
        variantId:variantId,
        score:this.calcScore(variant.valid,this.state.answers)
      }
    }).sort((a,b)=>{
      let ret=0;
      if(a.score<b.score){
        ret=1;
      } else if(a.score>b.score){
        ret=-1;
      };
      return ret;
    });

    console.log(results);


    if(!results.length){
      throw new Error("Похоже, нет подходящего варианта");
    } else {
      this.state.result=this.state.data.results[results[0].variantId];
    }
  }

  drawResults(){
    let data=this.state.data;
    let page=this.mk({cls:"page",node:this.state.node});
    this.mk({cls:"title",html:data.title,node:page});
    this.mk({cls:"note",html:this.state.result.note,node:page});
    let buttons=this.mk({cls:"buttons",node:page});
    this.mk({tag:"a",cls:"button",html:data.restart,node:buttons})
    .addEventListener("click",this.doAction.bind(this,this.stages.INIT),false);
  }

}
