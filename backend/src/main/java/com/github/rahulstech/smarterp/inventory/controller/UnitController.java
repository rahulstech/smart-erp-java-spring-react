package com.github.rahulstech.smarterp.inventory.controller;

import com.github.rahulstech.smarterp.inventory.dto.CreateUnitItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.UnitResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateUnitRequest;
import com.github.rahulstech.smarterp.inventory.service.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies/{companyId}/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    public ResponseEntity<@NonNull UnitResponse> createUnit(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreateUnitItemRequest request) {
        UnitResponse response = unitService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{unitId}")
    public UnitResponse updateUnit(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("unitId") UUID unitId,
            @Valid @RequestBody UpdateUnitRequest request) {
        return unitService.update(companyId, unitId, request);
    }

    @GetMapping("/{unitId}")
    public UnitResponse getUnit(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("unitId") UUID unitId) {
        return unitService.getById(companyId, unitId);
    }

    @GetMapping
    public List<UnitResponse> getUnits(
            @PathVariable("companyId") UUID companyId) {
        return unitService.getAll(companyId);
    }
}
