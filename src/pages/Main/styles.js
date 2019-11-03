import styled, { keyframes, css } from 'styled-components'

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: ${props => (props.error ? '2px solid red;' : '1px solid #eee;')};
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;

    &.error {
      animation: vibrate 0.05s 6 alternate;
    }
  }

  @keyframes vibrate {
    from {
      transform: translateX(-2px);
    }
    to {
      transform: translateX(2px);
    }
  }
`
const rotate = keyframes`
   from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`
export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`
export const Error = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background: #ffd2d2;
  color: #d8000c;
  transition: right 0.2s ease-in-out, width 5s ease-out, transform 0.2s ease-out;
  right: -300px;
  top: 10px;

  svg {
    position: absolute;
    left: 10px;


  }
  /* animation: ${props =>
    props.error
      ? 'errorin 0.2s ease-in-out 1 forwards, errorout 0.2s ease-in-out 5s forwards'
      : 'null'}; */

  &.error {
    animation: errorin 0.2s ease-in-out 1 forwards, errorout 0.2s ease-in-out 5s forwards;
  }
  @keyframes errorin {
    from {
      right: -300px;
    }

    /* 90% {
      transform: skewX(30deg);
    } */

    to {
      right: 0px;
    }
  }

  @keyframes errorout {
    from {
      right: 0px;
    }

    90% {
      right: 10px;
    }
    to {
      transform: skewX(-15deg);
      right: -300px;
    }
  }

  #timebar {
    height: 4px;
    width: 100%;
    background: #ffbaba;
    position: absolute;
    bottom: 0px;
    right: 0px;

    &.error {
      animation: timebar 4.5s ease-out 1 0.5s forwards;
    }

    @keyframes timebar {
      from {
        width: 100%;
      }

      to {
        width: 0%;
      }
    }
  }
`
