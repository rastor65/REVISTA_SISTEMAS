from .....mudules import path
from .gender import GenderDetail, GenderList

urlpatterns = [
    path('', GenderList.as_view()),
    path('<int:pk>', GenderDetail.as_view()),
]
