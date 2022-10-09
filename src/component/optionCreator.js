import React from 'react'

export default function optionCreator(arrInc, arrCorr){
        const optionArr = arrInc.concat(arrCorr).sort(() => Math.random() - 0.5).map( element => {      return {option: element, isSelected: false, isCorrect: false}})
        return optionArr
}
