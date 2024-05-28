import path from "path";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface initialTime {
    minutes: string
    seconds: string
}

const Div = styled.div`
    padding: 0;
    width: 480px;
    height: 520px;
    transform: rotate(-90deg);
    border: 1px solid #000;
`

const Timer = styled.circle<{timePassed: number, minutes: number, path: number}>`
    stroke-dasharray: ${props => props.path};
    stroke-dashoffset: ${props => {
        let offset: number = props.path / (props.minutes * 60)
        console.log(offset)
        return offset * props.timePassed
    }};
    transition: all 1s linear
    ;
`

const Input = styled.input`
    -webkit-appearance: none;
    border: 1px solid #000;
    background-color: transparent;
    height: 5px;
    width: 300px;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 1px solid #000000;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ffffff;
        cursor: pointer;
        transform: translateY(-40%);
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        background-color: #5c0000;
    }
`

export const PomodoroTimer = () => {


    const ref = useRef<HTMLInputElement>(null)
    const minutesRef = useRef<HTMLInputElement>(null)


    const [initialMinutes, setInitialMinutes] = useState(25);
    const [initialMinutesBreak, setInitialMinutesBreak] = useState(5);

    
    const [breakingTimeProcessing, setBreakingTimeProcessing] = useState(false)
    const [breakingMode, setBreakMode] = useState(false)
    const [pause, setPause] = useState(true)
    
    
    const initialTime: initialTime = {
        minutes: String(initialMinutes),
        seconds: '00'
    }
    
    const initialTimeBreak: initialTime = {
        minutes: String(initialMinutesBreak),
        seconds: '00'
    }
    
    const [time, setTime] = useState(initialTime)
    const [timePassed, setTimePassed] = useState(0)

    
    const startTimer = (e: React.MouseEvent<HTMLDivElement>) => {
        setPause(false)
    }

    const stopTimer = () => {
        setPause(true)
        setBreakMode(false)
    }

    const restart = (e: React.MouseEvent<HTMLDivElement>) => {
        setPause(true);
        setBreakMode(false);
        setTime(initialTime);
        setBreakingTimeProcessing(false)
        setTimePassed(0)
    }

    
    const changeMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
        let text = 25;
        if (ref.current?.value) {
            text = +ref.current?.value
        }
        setInitialMinutes(text)
        if (!breakingTimeProcessing) {
            setTime({
                ...time,
                minutes: String(text),
                seconds: '00'
            })
            setTimePassed(0)
        }
    }

    const changeMinutesBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        let text = 5;
        if (minutesRef.current?.value) {
            text = +minutesRef.current?.value
        }
        setInitialMinutesBreak(text)
        if (breakingTimeProcessing) {
            setTime(initialTimeBreak)
            setTimePassed(0)
        }
    }

    
    useEffect(() => {
        let timer: NodeJS.Timer;
        if (!pause || breakingMode) {
            timer = setInterval(() => {
                setTime({
                    ...time,
                    seconds: (+time.seconds - 1 > 9) ? String(+time.seconds - 1) : '0' + String(+time.seconds - 1)
                })
                setTimePassed(timePassed + 1)
                if (+time.seconds === 0) {
                    setTime({
                        minutes: String(+time.minutes - 1),
                        seconds: '59'
                    })
                }
                if (+time.minutes === 0 && +time.seconds === 0) {
                    setTime({
                        ...time,
                        seconds: '00'
                    })
                }
            }, 1000)
        }
        if (+time.seconds === 0 && +time.minutes === 0) {
            if (!breakingMode) {
                setBreakMode(true)
                setBreakingTimeProcessing(true)
                setTime(initialTimeBreak)
                setTimePassed(0)
            } else {
                setBreakMode(false)
                setBreakingTimeProcessing(true)
                setTime(initialTime)
                setTimePassed(0)
            }
        }
        return () => clearInterval(timer)
    }, [ time, pause ])

    return (
        <div>
            <Div>
                <svg width="480" height="480" viewBox="-10 0 235 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Timer timePassed={timePassed} minutes={breakingTimeProcessing ? initialMinutesBreak : initialMinutes} path={659.7} cx="105.5" cy="105.5" r="105" stroke="black" stroke-width="5px" />
                </svg>
            </Div>
            <span>{time.minutes}:</span>
            <span>{time.seconds}</span>
            <div>{timePassed}</div>
            <div>
                {
                    pause ? 
                        <span onClick={startTimer}>start</span> :
                        <span onClick={stopTimer}>stop</span>
                }
                <span onClick={restart}>restart</span>
            </div>
            <div>
                {
                    time.minutes === initialTime.minutes || pause ? 
                        <div>
                            <div>
                                <Input ref={ref} type="range" min={5} max={55} value={initialMinutes} step={'5'} onChange={changeMinutes} />
                                <div>{initialMinutes}</div>
                            </div>
                            <div>
                                <input ref={minutesRef} type="range" min={2} max={10} value={initialMinutesBreak} step={'2'} onChange={changeMinutesBreak} />
                                <div>{initialMinutesBreak}</div>
                            </div>
                        </div> :
                        <div>
                            <div>
                                <input ref={ref} type="range" min={5} max={55} value={initialMinutes} step={'5'} disabled />
                                <div>{initialMinutes}</div>
                            </div>
                            <div>
                                <input ref={minutesRef} type="range" min={2} max={10} value={initialMinutesBreak} step={'2'} disabled />
                                <div>{initialMinutesBreak}</div>
                            </div>
                        </div>
                }
            </div>

        </div>
    )
}