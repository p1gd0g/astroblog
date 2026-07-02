/**
 * 对图片 URL 进行预处理：
 * 1. 解包 wsrv.nl 代理 URL
 * 2. 将 mmbiz.qpic.cn 替换为自有域名
 */
export function transformImageUrl(url: string): string {
    if (url.startsWith('https://wsrv.nl')) {
        try {
            const parsed = new URL(url);
            const inner = parsed.searchParams.get('url');
            if (inner) url = inner;
        } catch { }
    }

    if (url.includes('mmbiz.qpic.cn')) {
        url = url.replace('http://mmbiz.qpic.cn', 'https://md.p1gd0g.cc');
    }

    return url;
}
