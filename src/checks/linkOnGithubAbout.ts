import cheerio from 'cheerio';
import execa from 'execa';
import fetch from 'node-fetch';

export const title = 'Github Repository contains link on About Section';

export default async function linkOnGithubAbout() {
  const { stdout: repoUrlStdout } = await execa.command(
    'git remote get-url origin',
  );

  const html = await (await fetch(repoUrlStdout)).text();

  const $ = cheerio.load(html);
  const linkElement = $('h2')
    .filter(function(this: Node) {
      return (
        $(this)
          .text()
          .trim() === 'About'
      );
    })
    .nextAll('div')
    .filter(function(this: Node) {
      return $(this).children('.octicon.octicon-link').length > 0;
    })
    .children('.octicon.octicon-link')
    .next()
    .children('a[href]');

  if (linkElement.length === 0) {
    throw new Error(`Project link not found on about section:
    - Make sure you add the link to the repo on the About section.
    - You will see an link 🔗 icon before the url if is the right place.
    `);
  }
}
