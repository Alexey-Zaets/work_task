from django import template
from django.utils.safestring import mark_safe
from django.contrib.auth.models import User


NO_COMMENTS = '<div class="alert alert-info" role="alert">{}</div>'
LINK = '<a href="/reply/comment/{}/" class="stretched-link">Reply</a>'
COMMENT_BODY = '''<div class="media position-relative border-bottom mt-2">
               <div class="media-body"><h5 class="mt-0">{}</h5>
               <p>{}</p>{}</div></div>'''

register = template.Library()

def get_children(comment):
    '''
    The function returns nested responses to the comment.
    '''
    return comment.comments.all()

@register.filter(name='commenttree')
def commenttree(query_set):
    '''
    The function recursively builds a comment tree in template.
    '''
    count = 0
    result = '<ul class="list-group list-group-flush">\n'
    if query_set.exists():
        for comment in query_set:
            reply = LINK.format(str(comment.id))
            reply = reply if comment.level < 2 else ''
            if isinstance(comment.author, User):
                author = comment.author.username
            else:
                author = 'Anonymous'
            result += '<li class="list-group-item">\n' + COMMENT_BODY.format(
                author, comment.comment, reply
            )
            count += 1
            children = get_children(comment)
            if children.exists():
                result += commenttree(children)
            if count >= 10:
                break
        result += '</li>\n'
        result += '</ul>'
    else:
        result = NO_COMMENTS.format('No comments yet!')
    return mark_safe(result)

commenttree.is_safe = True
