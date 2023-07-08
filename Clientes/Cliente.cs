using System.Text.Json.Serialization;

namespace Clientes
{
    public class Cliente
    {
        [JsonIgnore]
        public int IdCliente { get; set; }
        public string? NombreCliente { get; set; }
        public string? Direccion { get; set; }
        public string? Pais { get; set; }
        public string? CodigoPostal { get; set; }
        public string? NumeroTelefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? EstadoCuenta { get; set; }


    }
}