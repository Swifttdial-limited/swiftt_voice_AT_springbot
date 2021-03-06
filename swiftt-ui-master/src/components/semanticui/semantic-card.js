const React = require('react');

import './semantic-card.less';


const SemanticLinkCard = function statelessFunctionComponentClass(props) {
  return (
    <div>
      <div className="ui link four stackable cards">
        <div className="ui fluid card">
          <div className="image">
            <img src="./assets/people/1.jpg" />
          </div>
          <div className="content">
            <div className="header">Matt Giampietro</div>
            <div className="meta">
              <a>Friends</a>
            </div>
            <div className="description">
        Matthew is an interior designer living in New York.
            </div>
          </div>
          <div className="extra content">
            <span className="right floated">
        Joined in 2013
            </span>
            <span>
              <i className="user icon" />
        75 Friends
            </span>
          </div>
        </div>
        <div className="ui fluid card">
          <div className="image">
            <img src="./assets/people/2.jpg" />
          </div>
          <div className="content">
            <div className="header">Molly</div>
            <div className="meta">
              <span className="date">Coworker</span>
            </div>
            <div className="description">
        Molly is a personal assistant living in Paris.
            </div>
          </div>
          <div className="extra content">
            <span className="right floated">
        Joined in 2011
            </span>
            <span>
              <i className="user icon" />
        35 Friends
            </span>
          </div>
        </div>
        <div className="ui fluid card">
          <div className="image">
            <img src="./assets/people/3.jpg" />
          </div>
          <div className="content">
            <div className="header">Elyse</div>
            <div className="meta">
              <a>Coworker</a>
            </div>
            <div className="description">
        Elyse is a copywriter working in New York.
            </div>
          </div>
          <div className="extra content">
            <span className="right floated">
        Joined in 2014
            </span>
            <span>
              <i className="user icon" />
        151 Friends
            </span>
          </div>
        </div>
        <div className="ui fluid card">
          <div className="image">
            <img src="./assets/people/4.jpg" />
          </div>
          <div className="content">
            <div className="header">Elyse</div>
            <div className="meta">
              <a>Coworker</a>
            </div>
            <div className="description">
        Elyse is a copywriter working in New York.
            </div>
          </div>
          <div className="extra content">
            <span className="right floated">
        Joined in 2014
            </span>
            <span>
              <i className="user icon" />
        151 Friends
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

module.exports = {

  SemanticLinkCard,
};
