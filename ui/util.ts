interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchWithTimeout(
  resource: RequestInfo,
  options: FetchOptions = {}
) {
  const { timeout = 10000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

export function timeSince(seconds: number): string {
  let now = Date.now() / 1000;
  seconds = now - seconds;

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "y";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }

  interval = seconds / 60;
  return Math.floor(interval) + " m";
}

const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

export function urlify(text: string) {
  return text.replace(urlRegex, function (url) {
    url = url.startsWith("www") ? `http://${url}` : url;

    return `<a class="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

export function copyText(copyText: string) {
  navigator.clipboard.writeText(copyText);
}
