import execa from 'execa';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const title = 'Github Repository contains link on About Section';

export default async function linkOnGithubAbout() {
  const { stdout: repoUrlStdout } = await execa.command(
    'git remote get-url origin',
  );

  const html = await (await fetch(repoUrlStdout)).text();

  const urlMatch = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  const regex = new RegExp(urlMatch);

  const $ = cheerio.load(html);
  const aboutHeading = $('h2')
    .filter(function(this: Node) {
      return (
        $(this)
          .text()
          .trim() === 'About'
      );
    })
    .next()
    .next()
    .text()
    .trim();

  if (!aboutHeading) {
    throw new Error(`Project link not found on about section:
    - Make sure you add the link to the repo on the About section.
    - You will see an link 🔗 icon before the url if is the right place.
    `);
  } else if (!aboutHeading.match(regex)) {
    throw new Error(`Project link is not a link:
    - ${aboutHeading} is not a valid Url.
    - Check that you have an actual link on your repo About section.
    - You should see icon 🔗  before the url.
    `);
  }
}
