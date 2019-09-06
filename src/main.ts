import * as core from '@actions/core';

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

interface IParams {
  slug: string,
  xpi: string,
  username: string,
  password: string
}

async function uploadAddon(params: IParams) {
  const token = Buffer.from(`${params.username}:${params.password}`).toString('base64');

  const data = new FormData();

  data.append('slug', params.slug);
  data.append('xpiUpload', fs.createReadStream(params.xpi));

  const response = await axios.post(`https://addons.palemoon.org/panel/addons/?task=update&what=release&slug=${params.slug}`, data, {
    headers: {
      Authorization: `Basic ${token}`,
      ...data.getHeaders()
    }
  });

  if (response.data) {
    const matches = response.data.match(/<h2>Unable\sto\sComply<\/h2><ul><li>(.+?)<\/li><ul>/);

    if (matches) {
      throw new Error(`${response.statusText}: ${matches[1]}`);
    }
  }
}

async function run() {
  try {
    const slug = core.getInput('slug', { required: true });
    const xpi = core.getInput('xpi', { required: true });
    const username = core.getInput('username', { required: true });
    const password = core.getInput('password', { required: true });
    
    await uploadAddon({ slug, xpi, username, password });

    core.debug('Uploaded addon');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
