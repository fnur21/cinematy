// elementleri seçmek

const container = document.querySelector(".container");
const selectMovie = document.querySelector("#selectMovie");
const count = document.querySelector("#count");
const amount = document.querySelector("#amount");
// burada ".seats" yerine ".seat" olabilir, HTML'de kontrol etmen iyi olur
const seats = Array.from(document.querySelectorAll(".seat"));
const buyButton = document.querySelector("#buyButton");
runEventListeners()

// eğer biz en baz kısım olan container kısmındaki seat sınıflarından birine click eventi yaparsak o zaman koltuğun renginin değişmesini istiyoruz

function runEventListeners() {
    container.addEventListener("click", select);
    selectMovie.addEventListener("change", changeMovie); // burda dedik ki selectMovie kısmından eğer değişim olursa başka film seçersek biz changeMovie metodunu çalıştır . o metot da tekrar calculate metodunu çalıştıracak
    document.addEventListener("DOMContentLoaded", runPageLoaded);
    buyButton.addEventListener("click", buyTicket);
}

function runPageLoaded() {
    const selectedSeatsIndex = Storagex.getSelectedSeatsFromStorage();
    const fullSeatsIndex = Storagex.getFullSeatsFromStorage();

    seats.forEach((seat, index) => {
        if (selectedSeatsIndex.includes(index)) {
            seat.classList.add("selected");
        }
    })

    seats.forEach((seat, index) => {
        if (fullSeatsIndex.includes(index)) {
            seat.classList.add("full");
        }
    })

    selectMovie.selectedIndex = Storagex.getSelectedMovieIndexFromStorage();
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
    }
}

function changeMovie() {
    calculate();
    saveSelectedSeatsIndexToStorage();
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

function calculate() {
    const SelectedSeatsCount = getSelectedSeats().length;
    // const price = selectMovie.options[selectMovie.selectedIndex].value;
    const price = selectMovie.value;
    count.textContent = SelectedSeatsCount;
    amount.textContent = price * SelectedSeatsCount;
}

// buyTicket fonksiyonu eksik görünüyor, onu da eklemelisin eğer varsa
function buyTicket() {
    alert("Bilet satın alma işlemi başarılı!"); // örnek basit uyarı
}
