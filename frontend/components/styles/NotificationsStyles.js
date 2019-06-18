import styled from 'styled-components';

const NotificationsStyles = styled.div`
  padding: 10px;
  padding-top: 50px;
  position: relative;
  background: ${props => props.theme.softOcean};
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 40%;
  min-width: 500px;
  bottom: 0;
  transform: translateX(-100%);
  transition: all 0.3s;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
  z-index: 5;
  display: grid;
  grid-template-rows: auto 1fr auto;
  ${props => props.open && `transform: translateX(0);`};
  header {
    border-bottom: 5px solid ${props => props.theme.black};
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
  footer {
    border-top: 10px double ${props => props.theme.black};
    margin-top: 1rem;
    padding: 0 2rem;
    padding-top: 1rem;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    font-size: 2rem;
    font-weight: 500;
    width: 100%;
    overflow-y: scroll;

    p {
      margin: 0;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    height: 100%;

    li {
      display: inline-block;
    }

    .deleteNotification {
      position: relative;
      right: 0;
    }

    span {
      padding: 0.5rem;
      font-size: 2rem;
      margin-left: 1.3rem;
      cursor: pointer;
      &:hovert {
        transform: scale(1.3);
      }
    }
  }
`;

export default NotificationsStyles;
