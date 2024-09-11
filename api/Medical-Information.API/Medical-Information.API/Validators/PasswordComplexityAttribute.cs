using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Medical_Information.API.Validators
{
    public class PasswordComplexityAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var password = value as string;

            if (string.IsNullOrEmpty(password))
                return false;

            // Check for at least one lowercase, one uppercase, and one digit
            bool hasLowerChar = Regex.IsMatch(password, "[a-z]");
            bool hasUpperChar = Regex.IsMatch(password, "[A-Z]");
            bool hasDigit = Regex.IsMatch(password, "[0-9]");

            return hasLowerChar && hasUpperChar && hasDigit;
        }

        public override string FormatErrorMessage(string name)
        {
            return "Password must contain at least one uppercase letter, one lowercase letter, and one digit.";
        }
    }
}
