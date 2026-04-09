/*
    CCCSM (Cookie Clicker Cloud Save MOD)
    v.1.0.0β
*/

(function(){

    const DEFAULTS={
        webhook:'',
        interval:10
    };

    window.CCCSM={
        data:{...DEFAULTS},
        timer:null,

        start:function(){
            if(this.timer) clearInterval(this.timer);
            if(!this.data.webhook) return;

            if (!Game || !Game.ready) return;
            sendSaveAsFile();

            this.timer=setInterval(()=>this.send(),this.data.interval*60*1000);
            console.log('[CCCSM] started',this.data.interval,'min');
        },

        stop:function(){
            if(this.timer){
                clearInterval(this.timer);
                this.timer=null;
            }
        },

        send:async function(){
            try{
                const saveData=Game.WriteSave(1);
                const now=new Date();
                const fileName=`cookie_save_${now.toISOString().replace(/[:.]/g,'-')}.txt`;

                const blob=new Blob([saveData],{type:'text/plain'});
                const fd=new FormData();
                fd.append('file',blob,fileName);
                fd.append('payload_json',JSON.stringify({
                    content:`🍪 Auto Backup: ${now.toLocaleString()}`
                }));

                const res=await fetch(this.data.webhook,{method:'POST',body:fd});
                if(res.ok){
                    console.log('[CCCSM] success:',fileName);
                }else{
                    console.error('[CCCSM] failed:',res.status);
                }
            }catch(e){
                console.error('[CCCSM] error:',e);
            }
        }
    };

    Game.registerMod("CCCSM",{
        init:function(){

            // CCBM設定UI登録
            if(window.CCBM){
                window.CCBM.registerConfig("CCCSM","Cloud Save",function(container){

                    const wrap=document.createElement('div');

                    // webhook
                    const input=document.createElement('input');
                    input.placeholder='Webhook URL';
                    input.style.width='100%';
                    input.value=window.CCCSM.data.webhook;

                    // interval
                    const interval=document.createElement('input');
                    interval.type='number';
                    interval.min=1;
                    interval.value=window.CCCSM.data.interval;

                    // save btn
                    const btn=document.createElement('button');
                    btn.textContent='保存';
                    btn.onclick=()=>{
                        window.CCCSM.data.webhook=input.value;
                        window.CCCSM.data.interval=parseInt(interval.value)||10;
                        Game.WriteSave();
                        window.CCCSM.start();
                    };

                    wrap.appendChild(document.createTextNode('Webhook:'));
                    wrap.appendChild(input);
                    wrap.appendChild(document.createElement('br'));
                    wrap.appendChild(document.createTextNode('Interval(min):'));
                    wrap.appendChild(interval);
                    wrap.appendChild(document.createElement('br'));
                    wrap.appendChild(btn);

                    container.appendChild(wrap);
                });
            }

            // 起動
            setTimeout(()=>window.CCCSM.start(),2000);
        },

        save:function(){
            return JSON.stringify(window.CCCSM.data);
        },

        load:function(str){
            if(!str)return;
            try{
                const d=JSON.parse(str);
                window.CCCSM.data={...DEFAULTS,...d};
            }catch(e){}
        }
    });

})();