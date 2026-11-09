using System.ComponentModel.DataAnnotations;

namespace Project_Authentication.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string? UserName { get; set; }

        [Required]
        
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        
        [MinLength(8)]
        public string? Password { get; set; }

        
        [Required]
        public int RoleID { get; set; }

       
    }
}
