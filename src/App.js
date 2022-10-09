import React from 'react'
import Quiz from './component/Quiz.js'
import {nanoid} from 'nanoid'

export default function App(){
    
    const [quizData, setQuizData] = React.useState([])
    
    
    return (
              <Quiz />
    )
}