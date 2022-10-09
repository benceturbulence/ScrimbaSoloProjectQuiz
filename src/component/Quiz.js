import React from 'react'
import {nanoid} from 'nanoid'
import Confetti from "react-confetti"
import optionCreator from './optionCreator.js'
import StarterScreen from './StarterScreen'

export default function Quiz(){ 
    const [isSelectedStyle, setIsSelectedStyle] = React.useState({
        backgroundColor: "#D6DBF5", color: "#293264", border: "2px solid #D6DBF5"})
    const [fadeStyle, setFadeStyle] = React.useState({
        border: "2px solid #293264"})  
    const [userChoice, setUserChoice] = React.useState({})
    const [quizData, setQuizData] = React.useState([])
    const [isStarted, setIsStarted] = React.useState(false)
    const [isEvaluated, setIsEvaluated] = React.useState(false)
    const [score, setScore]=React.useState(0)

    function fetchData(){
        setIsStarted(prevState => !isStarted)
        fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple")
        .then( (res) => res.json())
        .then( (data) => handleChange(data.results))
        isStarted && setIsStarted(prevStatus => !prevStatus)
        isEvaluated && setIsEvaluated(prevStatus => !prevStatus)
    }

    function handleChange(data){
        setQuizData(prevData => 
            data.map( e => { 
            return {
                ...e,
                key: nanoid(),
                id: nanoid(),
                correctAnswer: e.correct_answer,
                options: optionCreator(e.incorrect_answers, e.correct_answer),
                selected: "",
                }
            })
        )}
    
    console.log(quizData)
    
    const questionHeader = quizData.map(e =>{ return (
        <div className="questionBox"><h2>{e.question}</h2>
            <div className="answerContainter">
                {e.options.map( opt => <span 
                                style= {
                                    opt.isCorrect ? {backgroundColor: "#94D7A2", border: "2px solid #94D7A2" } 
                                    : opt.isSelected && !opt.isCorrect  ? isSelectedStyle
                                    : fadeStyle }
                                className="answer"
                                onClick={!isEvaluated ? ()=>handleChoice(opt.option, e.id) : console.log("Do not cheat") }>{opt.option}</span>)}
            </div>
        </div>
    )})
      

   // It turns the isSelected of the option to true if selected
    // it gets the option object and maps it over if the value is same as the chosen 

    function changeOptions(op, choice){ 
        const newOptions = op.map(valasz => valasz.option == choice ? {...valasz, isSelected: !valasz.isSelected} : {...valasz, isSelected: false})
        console.log(newOptions)    
        return newOptions
    }
    
    //      adds the object to userChoice array
    function handleChoice(choice, id){
        setUserChoice(prevArray => {
            return {
                ...prevArray, [id]:choice 
                }})
                    
        // Set the clicked answer as chosen 
        setQuizData( prevArray => prevArray.map( e => e.id == id ? 
                    {...e, selected: choice,
                    options: changeOptions(e.options, choice),
                    } : e)
    )}
    
    function evaluator(valasz){
        valasz.isSelected && setScore(prevScore => prevScore+1)
        return {...valasz,isCorrect: true }
    }
    
    
    function evaluateAnswers(){
        console.log("I am clicked")
        setQuizData( prevArray => prevArray.map( e => {  
                    return {...e, 
                    options: e.options.map(valasz => valasz.option == e.correctAnswer ? evaluator(valasz) : valasz)
                    }})
        )
        setIsSelectedStyle(prevStyle => {
            return {backgroundColor: "#F8BCBC", color: "#293264", border: "2px solid #F8BCBC"}})     
        setFadeStyle(prevStyle => {
            return {color: "#4D5B9E", border: "2px solid #4D5B9E"}})
        
        setIsStarted(prevStatus => !prevStatus)
        setIsEvaluated(prevStatus => !prevStatus)    
    }
    
    
       
         return (
        <div className="container">
            {!isStarted && <StarterScreen />}
            {questionHeader}
            {isEvaluated && score == 0 && <Confetti />}
            <div className="buttonContainer">
                {isEvaluated && <span className="scoreHeader">You have scored {score}</span>}
                <button className = "evaluateBtn" onClick={!isStarted ? fetchData : evaluateAnswers}>{!isStarted && !isEvaluated ? "Play" : isStarted ? "Check answers" : "Play again" }</button>
            </div>
        </div>
        ) 
    } 