let userScore=0;
let cpuscore=0;

const choice=document.querySelectorAll(".choices");
const msg=document.querySelector("#msg");
const user=document.querySelector("#user-score");
const cpu=document.querySelector("#cpuscore");

const gencpuchoice=()=>{
    const options=["rock","paper","scissors"];
    const rdidx=Math.floor(Math.random()*3);
    return options[rdidx];
};
choice.forEach((choices)=>{
    choices.addEventListener("click",()=>{
        const userchoice=choices.getAttribute("id");
        playgame(userchoice);
    })
});
const drawgame=()=>{
    msg.innerText="Game was draw!! Play again";
    msg.style.backgroundColor="black";
};
const playgame=(userchoice)=>{
    let cpuchoice=gencpuchoice();
    if(userchoice===cpuchoice){
        drawgame();
    }
    else{
        let userwin=true;
        if(userchoice==="rock"){
        userwin=cpuchoice==="paper"?false:true;
        }
        else if(userchoice==="paper"){
            userwin=cpuchoice==="rock"?true:false;
        }
        else{
            userwin=cpuchoice==="rock"?false:true;
        }
        showWinner(userwin,userchoice,cpuchoice);
    }
};
const showWinner=(userwin,userchoice,cpuchoice)=>{
    if(userwin){
        userScore++;
        user.innerText=userScore;
        msg.innerText=`Your ${userchoice} beats cpu's ${cpuchoice} `;
        msg.style.backgroundColor="green";
    }
    else{
        cpuscore++;
        cpu.innerText=cpuscore;
        msg.innerText=`Cpu ${cpuchoice} beats your ${userchoice}`;
        msg.style.backgroundColor="red";
    }
    
};