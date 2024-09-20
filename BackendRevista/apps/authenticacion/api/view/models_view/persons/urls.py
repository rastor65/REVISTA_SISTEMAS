from .....mudules import path
from .persons import PersonList, PersonDetail

urlpatterns = [
    path('', PersonList.as_view()),
    path('<int:pk>/', PersonDetail.as_view(), name='update-person'),
]
