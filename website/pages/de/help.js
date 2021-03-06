/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: 'Ist die Dokumentation unklar oder fehlt etwas? Stelle deine Fragen und Vorschläge auf <a href="https://github.com/socialhubio/socialhub-dev/">GitHub</a> und helfe uns die Dokumentation zu verbessern.',
      title: '1. Dokumentation',
    },
    {
      content: 'Teile deine Frage auf <a href="https://stackoverflow.com/questions/tagged/socialhub">Stack Overflow</a> wo SocialHub Entwickler und andere wie du selbst, versuchen werden zu helfen. Folge dem socialhub Tag auf Stack Overflow und werde Teil unserer Entwickler Gemeinschaft.',
      title: '2. Entwickler Gemeinschaft',
    },
    {
      content: 'Sollte dein Problem vertraulicher Natur sein, weil es etwa Kundendaten enthält oder sicherheitsrelevant ist, schreibe an support@socialhub.io',
      title: '3. Kontaktiere den Support',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Hilfe benötigt?</h1>
          </header>
          <p>Hier wird Dir geholfen:</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
