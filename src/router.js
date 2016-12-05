import toRegex from 'path-to-regexp';


function decodeParam(val) {
  if (!(typeof val === 'string' || val.length === 0)) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }

    throw err;
  }
}

// Match the provided URL path pattern to an actual URI string. For example:
//   matchURI({ path: '/posts/:id' }, '/dummy') => null
//   matchURI({ path: '/posts/:id' }, '/posts/123') => { id: 123 }
function matchURI(route, path) {
  const keys = [];
  const pattern = toRegex(route.path, keys);
  const match = pattern.exec(path);

  if (!match) {
    return null;
  }

  const params = Object.create(null);

  for (let i = 1; i < match.length; i += 1) {
    params[keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }

  return {
    name: route.name,
    title: route.title(params),
    prevPath: route.prevPath(params),
    nextPath: route.nextPath(params),
    params
  };
}

function resolve(routes, path) {
  for (const route of routes) {
    const params = matchURI(route, path);

    if (params) {
      return params;
    }
  }

  return null;
}

export default { resolve };
