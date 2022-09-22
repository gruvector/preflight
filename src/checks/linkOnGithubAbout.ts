import cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { execaCommand } from 'execa';
import fetch from 'node-fetch';
import randomUserAgent from '../util/randomUserAgent';

export const title = 'GitHub repo has deployed project link under About';

export default async function linkOnGithubAbout() {
  const { stdout } = await execaCommand('git remote get-url origin');

  const repoUrl = stdout
    .replace('git@github.com:', 'https://github.com/')
    .replace('.git', '');

  const html = await (await fetch(repoUrl)).text();

  const $ = cheerio.load(html);

  const urlInAboutSection = $('h2')
    .filter(function (this: Element) {
      return $(this).text().trim() === 'About';
    })
    .nextAll('div')
    .filter(function (this: Element) {
      return $(this).children('.octicon.octicon-link').length > 0;
    })
    .children('.octicon.octicon-link')
    .next()
    .children('a[href]')
    .attr('href');

  if (!urlInAboutSection) {
    throw new Error(
      `Deployed project link not found in About section on ${repoUrl}. Click on the cog symbol to the right of the About heading and paste the Repl.it / Netlify / Fly.io link in the Website box.`,
    );
  }

  const response = await fetch(urlInAboutSection, {
    headers: {
      // For repl.it
      'user-agent': randomUserAgent(),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Project link in About section on ${repoUrl} is not returning a proper status code: the link returns status code ${response.status} (${response.statusText}).`,
    );
  }
}
