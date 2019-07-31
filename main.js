var mainState={
mf:[], //main field
lf:[], //left field
rf:[], //rigth field
tf:[], //top field
bf:[], //bottom field
mfd:[96,96,416,416],  // mf dimensions left x, top y, right x, bottom y
lfd:[0,96,96,416],    // lf dimensions left x, top y, right x, bottom y
rfd:[416,96,508,416], // rf dimensions left x, top y, right x, bottom y
tfd:[96,0,416,96],    // tf dimensions left x, top y, right x, bottom y
bfd:[96,416,416,508], // bf dimensions left x, top y, right x, bottom y
rsf:['r0','y0','b0','g0','p0'], //random for side fields
sod:0, // state 0-norm , 1-checkfield, 2-seekndstry, 3-wait, 4-next level, 5-game over
score:0,
preload:function(){
    game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally=true;
    game.scale.refresh();
    game.load.atlas('atlas','blocks-arrows.3.png','blocks-arrows.3.json');
},
create:function(){
    game.stage.backgroundColor='#000000';
    game.input.onTap.add(this.ontap,this);
    game.add.text(426,6,'Score',{font:"18px monospace",fill:"#ffffff"});
    this.labelScore=game.add.text(426,36,this.score,{font:"18px monospace",fill:"#ffffff"});
    game.add.text(10,36,'Restart',{font:"18px monospace",fill:"#ffffff"});
    for (let i=0;i<100;i++){
        this.mf[i]=game.add.sprite((i%10)*32+this.mfd[0],(~~(i/10))*32+this.mfd[1],'atlas','em');
    }
    for (let i=0;i<30;i++){
        this.tf[i]=game.add.sprite((i%10)*32+this.tfd[0],(~~(i/10))*32+this.tfd[1],'atlas',this.rsf[~~(Math.random()*this.rsf.length)]);
        this.bf[i]=game.add.sprite((i%10)*32+this.bfd[0],(~~(i/10))*32+this.bfd[1],'atlas',this.rsf[~~(Math.random()*this.rsf.length)]);
        this.rf[i]=game.add.sprite((i%3)*32+this.rfd[0],(~~(i/3))*32+this.rfd[1],'atlas',this.rsf[~~(Math.random()*this.rsf.length)]);
        this.lf[i]=game.add.sprite((i%3)*32+this.lfd[0],(~~(i/3))*32+this.lfd[1],'atlas',this.rsf[~~(Math.random()*this.rsf.length)]);
    }
    for (let i=0;i<16;i++){
        this.mf[~~(i/4)+(i%4*10)+33].frameName=['y0','em','b0','em','g0','em','r0','em','p0','em'][~~(Math.random()*10)];
    }
},
newfield:function(){
    this.mf.forEach((el)=>{el.frameName='em';});
    this.tf.forEach((el)=>{el.frameName=this.rsf[~~(Math.random()*this.rsf.length)];});
    this.rf.forEach((el)=>{el.frameName=this.rsf[~~(Math.random()*this.rsf.length)];});
    this.bf.forEach((el)=>{el.frameName=this.rsf[~~(Math.random()*this.rsf.length)];});
    this.lf.forEach((el)=>{el.frameName=this.rsf[~~(Math.random()*this.rsf.length)];});
    for (let i=0;i<16;i++){
        this.mf[~~(i/4)+(i%4*10)+33].frameName=['y0','em','b0','em','g0','em','r0','em','p0','em'][~~(Math.random()*10)];
    }
},
update:function(){
    if(this.sod==1){
        this.checkfield();
    } else if(this.sod==2){
        this.seekndstry();
    } else if(this.sod==4){
        this.newfield();
        this.score+=100;
        this.labelScore.text=this.score;
        this.sod=0;
    } else if(this.sod==5){
         //if (confirm("game"))
        alert('Game over!\nYour score: '+this.score+'\npress ok to restart.');
        this.restartgame();
    }
},
ontap:function(pointer, doubleTap){
    if(this.sod==0){
        if((pointer.x<=64)&&(pointer.y<=64))this.sod=5;
    if((pointer.x>=this.lfd[0])&&(pointer.x<=this.lfd[2]) &&(pointer.y>=this.lfd[1])&&(pointer.y<=this.lfd[3])){
        let ro=~~((pointer.y-this.lfd[1])/32);
        let i=0;
        while(i<10){
            if(this.mf[ro*10+i].frameName!='em'){
                if(i>0){
                    let co=i-1;
                    let ans=game.add.sprite(this.mfd[0],ro*32+this.mfd[1],'atlas',this.lf[ro*3+2].frameName[0]+'2');
                    let tween=game.add.tween(ans).to({x:co*32+this.mfd[0]},100);
                    tween.onComplete.add(()=>{this.mf[ro*10+co].frameName=ans.frameName;this.sod=2;ans.destroy();}, this);
                    this.sod=3;
                    tween.start();
                    this.lf[ro*3+2].frameName=this.lf[ro*3+1].frameName;
                    this.lf[ro*3+1].frameName=this.lf[ro*3].frameName;
                    this.lf[ro*3].frameName=this.rsf[~~(Math.random()*this.rsf.length)];
                }
                i=10;
            }
            i++;
        }
    } else if((pointer.x>=this.rfd[0])&&(pointer.x<=this.rfd[2]) &&(pointer.y>=this.rfd[1])&&(pointer.y<=this.rfd[3])){
        let ro=~~((pointer.y-this.rfd[1])/32);
        let i=9;
        while (i>-1){
            if(this.mf[ro*10+i].frameName!='em'){
                if(i<9){
                    let co=i+1;
                    let ans=game.add.sprite(this.mfd[2]-32,ro*32+this.mfd[1],'atlas',this.rf[ro*3].frameName[0]+'4');
                    let tween=game.add.tween(ans).to({x:co*32+this.mfd[0]},100);
                    tween.onComplete.add(()=>{this.mf[ro*10+co].frameName=ans.frameName;this.sod=2;ans.destroy();}, this);
                    this.sod=3;
                    tween.start();
                    this.rf[ro*3].frameName=this.rf[ro*3+1].frameName;
                    this.rf[ro*3+1].frameName=this.rf[ro*3+2].frameName;
                    this.rf[ro*3+2].frameName=this.rsf[~~(Math.random()*this.rsf.length)];
                }
                i=-1;
            }
            i--;
        }
    } else if((pointer.x>=this.tfd[0])&&(pointer.x<=this.tfd[2]) &&(pointer.y>=this.tfd[1])&&(pointer.y<=this.tfd[3])){
        let co=~~((pointer.x-this.tfd[0])/32);
        let i=0;
        while(i<10){
            if(this.mf[i*10+co].frameName!='em'){
                if(i>0){
                    let ro=i-1;
                    let ans=game.add.sprite(co*32+this.mfd[0],this.mfd[1],'atlas',this.tf[20+co].frameName[0]+'3');
                    let tween=game.add.tween(ans).to({y:ro*32+this.mfd[1]},100);
                    tween.onComplete.add(()=>{this.mf[ro*10+co].frameName=ans.frameName;this.sod=2;ans.destroy();}, this);
                    this.sod=3;
                    tween.start();
                    this.tf[20+co].frameName=this.tf[10+co].frameName;
                    this.tf[10+co].frameName=this.tf[co].frameName;
                    this.tf[co].frameName=this.rsf[~~(Math.random()*this.rsf.length)];
                }
                i=10;
            }
            i++;
        }
    } else if((pointer.x>=this.bfd[0])&&(pointer.x<=this.bfd[2]) &&(pointer.y>=this.bfd[1])&&(pointer.y<=this.bfd[3])){
        let co=~~((pointer.x-this.bfd[0])/32);
        let i=9;
        while(i>-1){
            if(this.mf[i*10+co].frameName!='em'){
                if(i<9){
                    let ro=i+1;
                    let ans=game.add.sprite(co*32+this.mfd[0],this.mfd[3]-32,'atlas',this.bf[co].frameName[0]+'1');
                    let tween=game.add.tween(ans).to({y:ro*32+this.mfd[1]},100);
                    tween.onComplete.add(()=>{this.mf[ro*10+co].frameName=ans.frameName;this.sod=2;ans.destroy();}, this);
                    this.sod=3;
                    tween.start();
                    this.bf[co].frameName=this.bf[10+co].frameName;
                    this.bf[10+co].frameName=this.bf[20+co].frameName;
                    this.bf[20+co].frameName=this.rsf[~~(Math.random()*this.rsf.length)];
                }
                i=-1;
            }
            i--;
        }
    }}
},
seekndstry:function(){
    let bd=false;
    this.mf.forEach((el,i)=>{
        let candi=[];
        if(el.frameName!='em'){
            candi=this.recsearch(i,el.frameName[0]);
            if(candi.length>2){
                bd=true;
                this.score+=(candi.length-2)*3;
                this.labelScore.text=this.score;
                candi.forEach((el)=>{this.mf[el].frameName='em'});
            }
        }
    });
    if(bd){
        this.sod=1;
    }else{
        let lgo=[0,1,2,3,4,5,6,7,8,9,10,19,20,29,30,39,40,49,50,59,60,69,70,79,80,89,90,91,92,93,94,95,96,97,98,99];
        let i=0;
        while((i<lgo.length)&&(this.mf[lgo[i]].frameName!='em')){i++;}
        this.sod=i<lgo.length?0:5;
    }
},
recsearch:function(i,typ,ar=[]){
    ar.push(i);
    if((i>9)&&(!ar.includes(i-10))&&(this.mf[i-10].frameName[0]==typ))ar.concat(this.recsearch(i-10,typ,ar));
    if((i%10>0)&&(!ar.includes(i-1))&&(this.mf[i-1].frameName[0]==typ))ar.concat(this.recsearch(i-1,typ,ar));
    if((i<90)&&(!ar.includes(i+10))&&(this.mf[i+10].frameName[0]==typ))ar.concat(this.recsearch(i+10,typ,ar));
    if((i%10<9)&&(!ar.includes(i+1))&&(this.mf[i+1].frameName[0]==typ))ar.concat(this.recsearch(i+1,typ,ar));
    return ar;
},
checkfield:function(i=0){
    let sf=true; //search field
    let ef=true; //empty field
    while(sf&&(i<100)){
        if(this.mf[i].frameName!='em'){
            ef=false;
            let k=1;
            let sn=true;
            if((this.mf[i].frameName[1]=='1')&&(i>9)){
                while(sn&&((~~(i/10))>=k)){
                    if(this.mf[i-k*10].frameName!='em'){
                        sn=false;
                        k--;
                    }
                    k++;
                }
                if(k>1){
                    let ans=game.add.sprite(this.mf[i].x,this.mf[i].y,'atlas',this.mf[i].frameName);
                    let tween=game.add.tween(ans).to({y:this.mf[i-(k-1)*10].y},100);
                    if((~~(i/10))<k){
                        tween.onComplete.add(()=>{this.tf[i%10].frameName=this.tf[i%10+10].frameName;this.tf[i%10+10].frameName=this.tf[i%10+20].frameName;this.tf[i%10+20].frameName=ans.frameName[0]+'0';this.sod=1;ans.destroy();},this);
                    } else {
                        tween.onComplete.add(()=>{this.mf[i-(k-1)*10].frameName=ans.frameName;this.sod=1;ans.destroy();},this);
                    }
                    sf=false;
                    this.sod=3;
                    this.mf[i].frameName='em';
                    tween.start();
                }
            } else if((this.mf[i].frameName[1]=='3')&&(i<90)){
                while(sn&&((9-(~~(i/10)))>=k)){
                    if(this.mf[i+k*10].frameName!='em'){
                        sn=false;
                        k--;
                    }
                    k++;
                }
                if(k>1){
                    let ans=game.add.sprite(this.mf[i].x,this.mf[i].y,'atlas',this.mf[i].frameName);
                    let tween=game.add.tween(ans).to({y:this.mf[i+(k-1)*10].y},100);
                    if((9-(~~(i/10)))<k){
                        tween.onComplete.add(()=>{this.bf[i%10+20].frameName=this.bf[i%10+10].frameName;this.bf[i%10+10].frameName=this.bf[i%10].frameName;this.bf[i%10].frameName=ans.frameName[0]+'0';this.sod=1;ans.destroy()},this);
                    } else {
                        tween.onComplete.add(()=>{this.mf[i+(k-1)*10].frameName=ans.frameName;this.sod=1;ans.destroy();},this);
                    }
                    sf=false;
                    this.sod=3;
                    this.mf[i].frameName='em';
                    tween.start();
                }
            } else if((this.mf[i].frameName[1]=='4')&&(i%10>1)){
                while(sn&&((i%10)>=k)){
                    if(this.mf[i-k].frameName!='em'){
                        sn=false;
                        k--;
                    }
                    k++;
                }
                if(k>1){
                    let ans=game.add.sprite(this.mf[i].x,this.mf[i].y,'atlas',this.mf[i].frameName);
                    let tween=game.add.tween(ans).to({x:this.mf[i-k+1].x},100);
                    if((i%10)<k){
                        tween.onComplete.add(()=>{this.lf[i%10+20].frameName=this.lf[i%10+10].frameName;this.lf[i%10+10].frameName=this.lf[i%10].frameName;this.lf[i%10].frameName=ans.frameName[0]+'0';this.sod=1;ans.destroy();},this);
                    } else {
                        tween.onComplete.add(()=>{this.mf[i-k+1].frameName=ans.frameName;this.sod=1;ans.destroy();},this);
                    }
                    sf=false;
                    this.sod=3;
                    this.mf[i].frameName='em';
                    tween.start();
                }
            } else if((this.mf[i].frameName[1]=='2')&&(i%10<9)){
                while(sn&&((9-(i%10))>=k)){
                    if(this.mf[i+k].frameName!='em'){
                        sn=false;
                        k--;
                    }
                    k++;
                }
                if(k>1){
                    let ans=game.add.sprite(this.mf[i].x,this.mf[i].y,'atlas',this.mf[i].frameName);
                    let tween=game.add.tween(ans).to({x:this.mf[i+k-1].x},100);
                    if((9-(i%10))<k){
                        tween.onComplete.add(()=>{this.rf[i%10+20].frameName=this.rf[i%10+10].frameName;this.rf[i%10+10].frameName=this.rf[i%10].frameName;this.rf[i%10].frameName=ans.frameName[0]+'0';this.sod=1;ans.destroy()},this);
                    } else {
                        tween.onComplete.add(()=>{this.mf[i+k-1].frameName=ans.frameName;this.sod=1;ans.destroy();},this);
                    }
                    sf=false;
                    this.sod=3;
                    this.mf[i].frameName='em';
                    tween.start();
                }
            }
        }
        if(sf)i++;//js hates me
    }
    if(sf&&(i>99)){
        this.sod=ef?4:2;
    }
},
restartgame:function(){
    this.score=0;
    this.labelScore.text='0';
    this.newfield();
    this.sod=0;
}
};

let width=512;
let height=512;
let game=new Phaser.Game(width, height);
game.cache=new Phaser.Cache(game);
game.state.add('main', mainState);
game.state.start('main');
