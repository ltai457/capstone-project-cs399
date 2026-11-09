using System.Security;

namespace Project_Authentication.Dto
{
    public class CommentInDto
    {
        public int ProjectID { get; set; }

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(2000, MinimumLength = 1)]
        public string? CommentText { get; set; }

        
    }
}
