import { Box } from '@/components/ui/v2/Box';
import { Input } from '@/components/ui/v2/Input';
import { Slider } from '@/components/ui/v2/Slider';
import { Text } from '@/components/ui/v2/Text';
import {
  MAX_SERVICE_MEMORY,
  MAX_SERVICE_VCPU,
  MEM_CPU_RATIO,
  MIN_SERVICE_MEMORY,
  MIN_SERVICE_VCPU,
} from '@/features/projects/resources/settings/utils/resourceSettingsValidationSchema';
import type { CreateServiceFormValues } from '@/features/run/components/CreateServiceForm';
import { useFormContext, useWatch } from 'react-hook-form';

export default function ComputeFormSection() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateServiceFormValues>();

  const formValues = useWatch<CreateServiceFormValues>();

  const handleSliderUpdate = (value: string) => {
    const updatedMem = parseFloat(value);

    if (Number.isNaN(updatedMem) || updatedMem < MIN_SERVICE_MEMORY) {
      return;
    }

    setValue('compute.memory', Math.floor(updatedMem), { shouldDirty: true });
    setValue('compute.cpu', Math.floor(updatedMem / 2.048), {
      shouldDirty: true,
    });
  };

  const handleCPUInputValueChange = (value: string) => {
    const updatedCPU = parseFloat(value);

    if (Number.isNaN(updatedCPU)) {
      return;
    }

    setValue('compute.memory', Math.floor(updatedCPU * MEM_CPU_RATIO));
  };

  const checkCPUBounds = (value: string) => {
    const updatedCPU = parseFloat(value);

    if (Number.isNaN(updatedCPU)) {
      setValue('compute.cpu', MIN_SERVICE_VCPU);
      setValue('compute.memory', MIN_SERVICE_VCPU * MEM_CPU_RATIO);
      return;
    }

    if (updatedCPU < MIN_SERVICE_VCPU) {
      setValue('compute.cpu', MIN_SERVICE_VCPU);
      setValue('compute.memory', MIN_SERVICE_VCPU * MEM_CPU_RATIO);
      return;
    }

    if (updatedCPU > MAX_SERVICE_VCPU) {
      setValue('compute.cpu', MAX_SERVICE_VCPU);
      setValue('compute.memory', MAX_SERVICE_VCPU * MEM_CPU_RATIO);
    }
  };

  const handleMemoryInputValueChange = (value: string) => {
    const updatedMem = parseFloat(value);

    if (Number.isNaN(updatedMem)) {
      return;
    }

    setValue('compute.cpu', Math.floor(updatedMem / MEM_CPU_RATIO));
  };

  const checkMemBounds = (value: string) => {
    const updatedMem = parseFloat(value);

    if (Number.isNaN(updatedMem)) {
      setValue('compute.cpu', MIN_SERVICE_VCPU);
      setValue('compute.memory', MIN_SERVICE_VCPU * MEM_CPU_RATIO);
      return;
    }

    if (updatedMem < MIN_SERVICE_MEMORY) {
      setValue('compute.cpu', MIN_SERVICE_VCPU);
      setValue('compute.memory', MIN_SERVICE_VCPU * MEM_CPU_RATIO);
      return;
    }

    if (updatedMem > MAX_SERVICE_MEMORY) {
      setValue('compute.cpu', MAX_SERVICE_VCPU);
      setValue('compute.memory', MAX_SERVICE_VCPU * MEM_CPU_RATIO);
    }
  };

  return (
    <Box className="space-y-4 rounded border-1 p-4">
      <Text variant="h4" className="font-semibold">
        Compute
      </Text>

      <Box className="flex flex-row space-x-2">
        <Input
          {...register('compute.cpu', {
            onChange: (event) => handleCPUInputValueChange(event.target.value),
            onBlur: (event) => checkCPUBounds(event.target.value),
          })}
          id="compute.cpu"
          label="CPU"
          className="w-full"
          hideEmptyHelperText
          error={!!errors?.compute?.cpu}
          helperText={errors?.compute?.cpu.message}
          fullWidth
          autoComplete="off"
          type="number"
        />
        <Input
          {...register('compute.memory', {
            onChange: (event) =>
              handleMemoryInputValueChange(event.target.value),
            onBlur: (event) => checkMemBounds(event.target.value),
          })}
          id="compute.memory"
          label="Memory"
          className="w-full"
          hideEmptyHelperText
          error={!!errors?.compute?.memory}
          helperText={errors?.compute?.memory?.message}
          fullWidth
          autoComplete="off"
          type="number"
        />
      </Box>
      <Slider
        value={formValues.compute.memory}
        onChange={(_event, value) => handleSliderUpdate(value.toString())}
        max={MAX_SERVICE_MEMORY}
        min={MIN_SERVICE_MEMORY}
        step={256}
        aria-label="Compute resources"
        marks
      />
    </Box>
  );
}
