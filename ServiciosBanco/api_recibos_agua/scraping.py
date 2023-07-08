import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def obtener_deuda(url, codigo_cliente, correo, dni):
    payload = {
        'codigo': codigo_cliente,
        'email': correo,
        'dni': dni,
    }

    response = requests.post(url, data=payload)
    soup = BeautifulSoup(response.content, "html.parser")
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    total_a_pagar_label = soup.find("th", string="TOTAL A PAGAR: ")
    total_a_pagar_value = None
    if total_a_pagar_label:
        total_a_pagar_value = total_a_pagar_label.find_next_sibling("th").text.strip()

    return total_a_pagar_value
'''
url = "https://pagovisa.epstacna.com.pe:8443" 
codigo_cliente = "11111"  
correo = "apiagua@gmail.com"
dni = "87654321"

deuda = obtener_deuda(url, codigo_cliente, correo, dni)

if deuda is not None:
    print(f"Deuda para el cliente {codigo_cliente}: {deuda}")
else:
    print("No se encontró información de deuda para el cliente.") '''