"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const styled_components_1 = tslib_1.__importStar(require("styled-components"));
exports.default = styled_components_1.default.button `
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

    ${props => props.secondary &&
    styled_components_1.css `
            background: lightseagreen;
            color: white;
        `}
    ${props => props.disabled &&
    styled_components_1.css `
            background-color: gray;
            pointer-events: none;
        `}
`;
//# sourceMappingURL=Button.js.map