// elementleri seçmek

const container = document.querySelector(".container");
const selectMovie = document.querySelector("#selectMovie");
const count = document.querySelector("#count");
const amount = document.querySelector("#amount");
const clearButton = document.querySelector("#clearbutton");
const seats = Array.from(document.querySelectorAll(".seat"));
const buyButton = document.querySelector("#buybutton");

runEventListeners();

// eğer biz en baz kısım olan container kısmındaki seat sınıflarından birine click eventi yaparsak o zaman koltuğun renginin değişmesini istiyoruz

function runEventListeners() {
    container.addEventListener("click", select);
    selectMovie.addEventListener("change", changeMovie); // burda dedik ki selectMovie kısmından eğer değişim olursa başka film seçersek biz changeMovie metodunu çalıştır . o metot da tekrar calculate metodunu çalıştıracak
    document.addEventListener("DOMContentLoaded", runPageLoaded);
    buyButton.addEventListener("click", buyTicket);
    clearButton.addEventListener("click", clearAll);
}

function runPageLoaded() {
    // sayfa yüklendiğinde  local storageden bana seçili olan koltukları getir
    const selectedSeatsIndex = Storagex.getSelectedSeatsFromStorage();
    // Local storage’tan “dolu (satılmış)” koltuk indekslerini al
    const fullSeatsIndex = Storagex.getFullSeatsFromStorage();


    // Tüm koltuk elemanlarını (seats NodeList’i) döner
    seats.forEach((seat, index) => {
        // Eğer bu koltuğun indeksi, seçili koltuklar listesinde varsa…
        if (selectedSeatsIndex.includes(index)) {
            //   …koltuğa “selected” sınıfını ekle 
            seat.classList.add("selected");
        }
    })

    seats.forEach((seat, index) => {
        if (fullSeatsIndex.includes(index)) {
            seat.classList.add("full");
        }
    })

    // *Seçili film (bilet fiyatı) indeksini local storage’tan al
    selectMovie.selectedIndex = Storagex.getSelectedMovieIndexFromStorage();
    //* Seçili koltuk sayısı ve toplam ücreti yeniden hesapla‑göste
    calculate();
}

function select(e) {
    const selectedElement = e.target.parentElement;
    // Burada classList.contains içinde .full değil, sadece 'full' olacak.
    if (selectedElement.classList.contains("seat") && !selectedElement.classList.contains("full")) {
        // selectedElement.classList.add("selected"); ---> bu şekilde koltuk seçildiğinde sarı olur ama tekrar bastığında eski haline dönmez bu yüzden add yerine toggle eklememiz lazım (toggle ne yapıyorsa aynı şekilde zıttını da yapıyor)
        selectedElement.classList.toggle("selected");
        calculate();
        saveSelectedSeatsIndexToStorage(); // seçimi kaydetmeyi unutma
        saveSelectedMovieIndexToStorage();
    }
}

function changeMovie() {
    calculate();
    saveSelectedMovieIndexToStorage();
}

function getSelectedSeats() {
    //! burda [... ] yapısı demek neresi tanımlanmışsa nereyi seçmek istiyorsa ordaki elementleri bir dizi halinde tutar == ya da bunu array.from ile de yapabilirdin
    const selectedList = [...container.querySelectorAll(".selected")];
    return selectedList; // ekranda seçili olan koltukları dönüyor yani
}

function getSelectedSeatsIndex() {
    const selectedList = getSelectedSeats();
    const selectedSeatsIndex = selectedList.map((seat) => {
        return seats.indexOf(seat);
    })

    return selectedSeatsIndex;
}

function saveSelectedSeatsIndexToStorage() {
    const selectedSeatsIndex = getSelectedSeatsIndex();
    Storagex.addSelectedSeatToStorage(selectedSeatsIndex);
}
function saveSelectedMovieIndexToStorage(){
    const selectedMovieIndex = selectMovie.selectedIndex;
    Storagex.addSelectedMovieToStorage(selectedMovieIndex);
}


function calculate() {
    const selectedSeatsCount = getSelectedSeats().length;
    // const price = selectMovie.options[selectMovie.selectedIndex].value;
    const price = selectMovie.value;
    count.textContent = selectedSeatsCount;
    amount.textContent = price * selectedSeatsCount;
}

function buyTicket() {
    if(confirm("satın almak istiyor musunuz?")){
       const selectedSeats= getSelectedSeats();
        const selectedSeatsIndex= getSelectedSeatsIndex();
       selectedSeats.forEach(seat => {
        seat.classList.remove("selected");
    seat.classList.add("full");
    });
       Storagex.addFullSeatToStorage(selectedSeatsIndex);
       Storagex.addSelectedSeatToStorage(getSelectedSeatsIndex());

     
}
}
function clearAll() {
  if (!confirm("Tüm seçimleri silmek istediğinize emin misiniz?")) return;

  /* Local storage temizle */
  Storagex.clearStorage();     

  /* Arayüz temizle */
  seats.forEach(seat => seat.classList.remove("selected", "full"));

  /*  Film seçimini varsayılana çek */
  selectMovie.selectedIndex = 0;

  /* Sayaçları sıfırla */
  calculate();                
}




