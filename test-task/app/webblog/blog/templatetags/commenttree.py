from django import template
from django.utils.safestring import mark_safe


register = template.Library()


def get_children(comment):
    return comment.comments.all()

@register.filter(name='commenttree')
def commenttree(query_set):
    count = 0
    result = '<ul>\n'
    if query_set.exists():
        for comment in query_set:
            reply = '''<a href="/reply/comment/''' \
            + str(comment.id) + '''/" class="stretched-link">Reply</a>'''
            reply = reply if comment.level < 2 else ''
            result += '<li>\n' \
            '''
            <div class="media position-relative border-bottom mt-2">
            <div class="media-body">
            <h5 class="mt-0">''' + comment.author.username + '''</h5>''' \
            '''<p>''' + comment.comment + '''</p>''' \
            '''{}</div></div>'''.format(reply)
            count += 1
            childrens = get_children(comment)
            if childrens.exists():
                result += commenttree(childrens)
            if count >= 10:
                break
        result += '</li>\n'
        result += '</ul>'
    else:
        result = '<div class="alert alert-info" role="alert"> \
        No comments yet</div>'
    return mark_safe(result)

commenttree.is_safe = True