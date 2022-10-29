# Aplikacja webowa do przeprowadzania egzaminów

## Opis
Aplikacja posiada dwóch aktorów Teacher - osoba odpowiedzialna za tworzenie i zarządzanie egzaminami, Student - osoba odpowiedzialna za uzupełnianie egzaminu. Teacher po zalogowaniu się na swoje konto ma możliwość wyświetlenia wcześniej utworzonych egzaminów. Może stworzyć nowy egzamin. Każdy egzamin posiada swoja konfigurację (czas, w którym egzamin jest otwarty i każdy ze studentów może go wypełnić, maksymalną liczbę otworzeń egzaminu, itp.). Każdy egzamin posiada swoją bazę pytań, a każde pytanie swoją bazę odpowiedzi z określeniem, która jest poprawna, a która nie. Każde pytanie może zawierać tekst i obrazek. Odpowiedź tak samo. Student po otworzeniu egzaminu, wybiera odpowiedzi w danych pytaniach i na samym końcu zatwierdza i wysyła wypełniony egzamin. Teacher ma możliwość sprawdzenia różnych statystyk z wypełnionych egzaminów. Można sprawdzić np. jakie pytania były najtrudniejsze (miały najwięcej błędnych odpowiedzi). Pytania w egzaminie będą generowane losowo (kolejność pytań), a odpowiedzi w każdym pytaniu też losowo (kolejność odpowiedzi w każdym pytaniu). Student na samej górze otwartego egzaminu będzie widział czas ile czasu zostało do końca egzaminu. Po zakończeniu czasu test będzie automatycznie zatwierdzany i wysyłany. Wszystkie interakcje Studenta będą zapisywały się w bazie danych jako logi, żeby Teacher mógł monitorować Studenta. Teacher będzie mógł tworzyć i zarządzać już stworzonymi kontami Studentów przypisanymi do każdego egzaminu.

## Aktorzy
- Teacher - odpowiedzialny za CRUD egzaminów w tym pytań i odpowiedzi oraz za wyświetlanie różnych statystyk i wykresów dotyczących wypełnionych egzaminów przez aktora Student
- Student - odpowiedzialny za zalogowanie się do egzaminu, jego wypełnienie, zatwierdzenie i wyświetlenie punktacji z wybranymi odpowiedziami

## Funkcjonalności
### Funkcjonalności aktora Student:
- logowanie do aplikacji
- wypełnianie egzaminu (wybranie odpowiedzi w pytaniach)
- zatwierdzanie egzaminu (zapisanie wybranych odpowiedzi)
- sprawdzenie punktacji (ile udzielonych odpowiedzi było poprawnych na ile wszystkich)
- sprawdzenie odpowiedzi (wyświetlenie pytań z odpowiedziami z oznaczeniem czy wybrana odpowiedź była poprawna czy niepoprawna)
- wyświetlenie czasu wypełniania egzaminu

### Funkcjonalności aktora Teacher:
- logowanie do aplikacji
- rejestracja nowego konta w aplikacji (jeszcze do ustalenia czy każdy może stworzyć swoje konto Teacher czy tylko administrator aplikacji)
- CRUD egzaminów (tworzenie, usuwanie, edycja egzaminów)
- konfigurowanie ustawień egzaminów
- od kiedy, do kiedy można wypełnić egzamin
- maksymalna liczba logowań do danego egzaminu w trakcie jego trwania
- czy po zatwierdzeniu egzaminu ma być pokazana punktacja, odpowiedzi, czas
- czy mają być zapisywane logi
- CRUD pytań (tworzenie, usuwanie, edycja pytań)
- CRUD odpowiedzi (tworzenie, usuwanie, edycja odpowiedzi)
- wyświetlanie logów (rejestru zdarzeń) każdego ze Studentów
- wyświetlanie punktacji każdego ze Studentów
- wyświetlanie wybranych odpowiedzi każdego ze Studentów
- CRUD studentów przypisanych do egzaminu (tworzenie, usuwanie, edycja studentów)
