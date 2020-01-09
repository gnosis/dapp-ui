import styled from 'styled-components'

interface ButtonProps {
    secondary?: boolean
}

export default styled.button<ButtonProps>`
    display: inline-block;

    border-radius: 25px;
    border: none;

    padding: 0.5rem 0;
    margin: 0.5rem 1rem;
    width: 14rem;

    background: palevioletred;
    color: white;

    font-weight: 600;

    cursor: pointer;

    transition: all 0.25s ease-in-out;

    &:hover {
        box-shadow: 0px 0px 19px 0px #db709359;
        background-color: #e8477c;
    }

    ${props =>
        props.secondary &&
        `
            background: lightseagreen;
            color: white;
        `}
    ${props =>
        props.disabled &&
        `
            background-color: gray;
            pointer-events: none;
        `}
`
