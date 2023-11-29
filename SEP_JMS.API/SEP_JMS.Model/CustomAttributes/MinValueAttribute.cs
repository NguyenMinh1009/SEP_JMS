using System.ComponentModel.DataAnnotations;

namespace SEP_JMS.Model.CustomAttributes
{

    [AttributeUsage(AttributeTargets.Property)]
    public class MinValueAttribute : ValidationAttribute
    {
        private readonly int _minValue;

        public MinValueAttribute(int minValue)
        {
            this._minValue = minValue;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value != null && Convert.ToInt32(value) < _minValue)
            {
                return new ValidationResult($"The field {validationContext.DisplayName} must be higher than or equal to {_minValue}.");
            }
            return ValidationResult.Success;
        }
    }
}
