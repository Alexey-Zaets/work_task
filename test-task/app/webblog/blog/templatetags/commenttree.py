from django import template
from django.utils.safestring import mark_safe


register = template.Library()


def get_children(comment):
    return comment.comments.all()

@register.filter(name='commenttree')
def commenttree(query_set):
    result = '<ul>\n'
    if query_set.exists():
        for comment in query_set:
            result += '<li>\n' \
            '''
            <div class="media position-relative border-bottom mt-2">
            <div class="media-body">
            <h5 class="mt-0">''' + comment.author.username + '''</h5>''' \
            '''<p>''' + comment.comment + '''</p>''' \
            '''<a href="/reply/comment/''' + str(comment.id) + '''/" class="stretched-link">Reply</a>
            </div>
            </div>
            '''
            childrens = get_children(comment)
            if childrens.exists():
                result += commenttree(childrens)
            result += '</li>\n'
    result += '</ul>'
    return mark_safe(result)

commenttree.is_safe = True