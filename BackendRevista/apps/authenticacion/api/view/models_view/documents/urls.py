from .....mudules import path
from .documents import DocumentList, DocumentDetail

urlpatterns = [
    path('', DocumentList.as_view()),
    path('<int:pk>', DocumentDetail.as_view()),
]