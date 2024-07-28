import { useCallback, useEffect, useState } from "react";
import useWords from "./useWords";

import useCountdown from "./useCountdown";
import useTypings from "./useTypings";
import { countErrors,debug } from "../utils/helper";

export type State = "start" | "run" | "finish";

const NUMBER_OF_WORDS = 12;
const COUNTDOWN_SECONDS = 30;

const useEngine = () =>{
    const [state,setState] = useState<State>("start"); 
    const {words,updateWords} = useWords(NUMBER_OF_WORDS);
    const{timeLeft, startCountdown, resetCountdown} = useCountdown(COUNTDOWN_SECONDS);
    const{typed, cursor, clearTyped, resetTotalTyped, totalTyped} = useTypings(state!=="finish");

    const[errors,setErrors] = useState(0);
    const isStarting = state === "start" && cursor>0;
    const areWordsFinished = cursor === words.length;

    const sumErrors = useCallback(()=>{
        debug(`cursor: ${cursor} - words.length: ${words.length}`);
        const wordsReached = words.substring(0, Math.min(cursor, words.length));
        setErrors((prevErrors)=>prevErrors + countErrors(typed,wordsReached));
    },[typed,words,cursor]);

    useEffect(()=>{
        if(isStarting){
            setState("run");
            startCountdown();

        }
    },[isStarting,startCountdown]);

    useEffect(()=>{
        if(!timeLeft && state === "run"){
            debug("time is up...");
            setState("finish");
            sumErrors();
            
            

        }
    },[timeLeft,state,sumErrors]);

    useEffect(()=>{
        if(areWordsFinished){
            debug("words are finished...");
            sumErrors();
            updateWords();
            clearTyped();

        }
    },[
        
        
        clearTyped,
        
        areWordsFinished,
        updateWords,
        sumErrors,

    ]);

    const restart = useCallback(()=>{
        console.log("restarting...");
        resetCountdown();
        resetTotalTyped();
        setState("start");
        setErrors(0);
        updateWords();
        clearTyped();
        
    },[clearTyped, updateWords, resetCountdown, resetTotalTyped]);


    return {state,words,timeLeft,typed, errors, totalTyped, restart};
}
export default useEngine;